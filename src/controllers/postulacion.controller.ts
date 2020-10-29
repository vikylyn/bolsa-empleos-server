import * as express from "express";
import { interfaces, controller, httpGet, httpPost, request, response, requestParam, httpPut, queryParam, httpDelete } from 'inversify-express-utils';
import { inject } from "inversify";
import { TYPES } from "../../config/types";
import verificaToken from '../middlewares/verificar-token';
import validarCampos from '../middlewares/administrador/validar-campos';
import { body } from 'express-validator';
import { IPostulacionService } from '../interfaces/postulacion.service';
import { Postulacion } from '../entity/postulacion';
import { IContratacionService } from '../interfaces/contratacion.service';
import { ISolicitanteService } from '../interfaces/solicitante.service';
import { Solicitante } from '../entity/solicitante';
import { Contratacion } from '../entity/contratacion';
 
@controller("/postulacion")    
export class PostulacionController implements interfaces.Controller {  
 
    constructor( @inject(TYPES.IPostulacionService) private postulacionService: IPostulacionService,
                 @inject(TYPES.IContratacionService) private contratacionService: IContratacionService,
                 @inject(TYPES.ISolicitanteService) private solicitanteService: ISolicitanteService) {}  
 
    @httpGet("/lista/empleador/:id",verificaToken)
    private async listar(@queryParam("desde") desde: number,@requestParam("id") id: number, req: express.Request, res: express.Response, next: express.NextFunction) {
        let postulaciones = await this.postulacionService.listar(id, desde);
        let total = await this.postulacionService.contarPorIdVacante(id);
        return res.status(200).json({
            ok: true,
            postulaciones: postulaciones,
            total
        });
    }   
    @httpGet("/buscar/:id",verificaToken)
    private async buscar(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const postulacion: Postulacion = await this.postulacionService.buscar(id);
            if (!postulacion) {
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe una postulacion con el ID ${id}`
                });
            }
            return res.status(201).json({
                ok: true,
                postulacion: postulacion,
            });
        } catch (err) {
            res.status(400).json({
                ok: false, 
                error: err.message 
            });
        }
    } // 
    @httpPost("/",verificaToken, 
        body('id_solicitante','El id del Solicitante es oblidatorio').not().isEmpty(),
        body('id_vacante','El id de la vacante es oblidatorio').not().isEmpty(),
        validarCampos
        )
    private async postularSolicitante(@request() req: express.Request, @response() res: express.Response) {

        
        try { 
            const solicitante: Solicitante = await this.solicitanteService.buscar(req.body.id_solicitante);
            if(solicitante.ocupado === true) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Solicitante con un empleo activo',  
                });
            }
            const contratacion: Contratacion = await this.contratacionService.buscarPorSolicitanteVacante(solicitante.id, req.body.id_vacante);
            if (contratacion) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error, Ya postulo para la vacante',  
                });
            }

            const buscar_postulacion: Postulacion = await this.postulacionService.buscarPorSolicitanteVacante(solicitante.id, req.body.id_vacante);
            if (buscar_postulacion) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error, Ya postulo para la vacante',  
                });
            }
            const postulacion = await this.postulacionService.postularSolicitante(req.body); 
            if(postulacion) {
                return res.status(201).json({
                    ok: true,
                    mensaje: 'Postulacion adicionada  exitosamente',  
                    postulacion: postulacion
                });
            }else {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al adicionar postulacion', 
                });
            }
           
           
        } catch (err) {
            res.status(500).json({
                ok: false, 
                error: err.message 
             });
        }
    } 

 /*   @httpPut("/aceptar-solicitante/:id",
        verificaToken
    )
    private async aceptarSlicitante(@requestParam("id") id: number,@request() req: express.Request, @response() res: express.Response) {
          
        try {
            const postulacion = await this.postulacionService.buscar(id);
            if (!postulacion) {
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe una postulacion con el ID ${id}`
            });
            }
            const postulacion_modificada = await this.postulacionService.aceptarSolicitante(postulacion.id);
            if (postulacion_modificada.affected === 1) {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Solicitante aceptado para la vacante'
                });
            } else {
                
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Error al aceptar solicitante',
                });
            }
        } catch (err) {
            res.status(400).json({  
                ok:false, 
                error: err.message });
        }
    } 
*/
    @httpGet("/listar-favoritos/:id",verificaToken)
    private async listarFavoritos(@queryParam("desde") desde: number,@requestParam("id") id: number, req: express.Request, res: express.Response, next: express.NextFunction) {
        let postulaciones = await this.postulacionService.listarFavoritos(id, desde);
        return res.status(200).json({
            ok: true,
            postulaciones: postulaciones
        });
    } 
    @httpPut("/favorito/:id",verificaToken)  
    private async favorito(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const postulacion = await this.postulacionService.favorito(id);
            if (postulacion.affected === 1){
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Postulacion adicionada a favoritos'
                })
            }else {
                return res.status(400).json({
                    ok:false,
                     mensaje: 'Error al establecer como favorito',
                });
            }

        } catch (err) {
            res.status(400).json({ 
                ok: false,  
                error: err.message 
            });  
        }
    }
    @httpPut("/quitar-favorito/:id",verificaToken)  
    private async quitarFavorito(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const postulacion = await this.postulacionService.quitarFavorito(id);
            if (postulacion.affected === 1){
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Postulacion quitada de favoritos'
                })
            }else {
                return res.status(400).json({
                    ok:false,
                     mensaje: 'Error al quitar de favoritos',
                });
            }

        } catch (err) {
            res.status(400).json({ 
                ok: false,  
                error: err.message 
            });  
        }
    }

    @httpDelete("/:id",verificaToken)  
    private async eliminar(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const postulacion = await this.postulacionService.eliminar(id);
            if (postulacion.affected === 1){
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Postulacion eliminada exitosamente'
                })
            }else {
                return res.status(400).json({
                    ok:false,
                     mensaje: 'Error al eliminar postulacion',
                });
            }

        } catch (err) {
            res.status(500).json({ 
                ok: false,  
                error: err.message 
            });  
        }
    }
    @httpGet("/lista/solicitante/:id",verificaToken)
    private async listarPorSolicitante(@queryParam("desde") desde: number,@requestParam("id") id: number, req: express.Request, res: express.Response, next: express.NextFunction) {
        let postulaciones: Postulacion[] = await this.postulacionService.listarPorSolicitante(id, desde);
        let total = await this.postulacionService.contarPorIdSolicitante(id);

        return res.status(200).json({
            ok: true,
            postulaciones: postulaciones,
            total
        });
    } 
    @httpGet("/:id_solicitante/:id_vacante",verificaToken)
    private async buscarporIdSolicitanteVacante(@requestParam("id_solicitante") id_solicitante: number,
                                                @requestParam("id_vacante") id_vacante: number,
                                                @request() req: express.Request, 
                                                @response() res: express.Response) {


        try { 
            // verificando si existe solicitante
            const solicitante: Solicitante = await this.solicitanteService.buscar(id_solicitante);
            if(!solicitante) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe un solicitante con ese id'       
                });
            }
            // verificando si existe contratacion
            const contratacion: Contratacion = await this.contratacionService.buscarPorSolicitanteVacante(solicitante.id, id_vacante);
            // verificando si la contratacion  a sido confirmada
            if (contratacion && contratacion.confirmado) {
                return res.status(200).json({
                    ocupado: solicitante.ocupado,
                    contratado: true,
                    postulando: false,
                    aceptado: true,
                    contratacion
                });
            }
            // si la contratacion no ha sido confirmada
            if (contratacion && !contratacion.confirmado) {
                const buscar_postulacion: Postulacion = await this.postulacionService.buscarPorSolicitanteVacante(solicitante.id, id_vacante);
                if (buscar_postulacion) {
                    return res.status(200).json({
                        ocupado: solicitante.ocupado,
                        contratado: true,
                        postulando: true,
                        aceptado: buscar_postulacion.aceptado,
                        postulacion: buscar_postulacion,
                        contratacion
                    });
                }
            }

            const buscar_postulacion: Postulacion = await this.postulacionService.buscarPorSolicitanteVacante(solicitante.id, id_vacante);
            if (buscar_postulacion) {
                return res.status(200).json({
                    ocupado: solicitante.ocupado,
                    postulando: false,
                    aceptado: buscar_postulacion.aceptado,
                    postulacion: buscar_postulacion,
                    contratado: false
                });
            }else {
                return res.status(200).json({
                    ocupado: solicitante.ocupado,
                    postulando: true,
                    contratado: false,
                    aceptado: false,
                });
            }
        
        } catch (err) {
            res.status(500).json({
                ok: false, 
                error: err.message 
             });
        }
    } 
}