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
 
@controller("/postulacion")    
export class PostulacionController implements interfaces.Controller {  
 
    constructor( @inject(TYPES.IPostulacionService) private postulacionService: IPostulacionService,
    @inject(TYPES.IContratacionService) private contratacionService: IContratacionService) {}  
 
    @httpGet("/listar/:id",verificaToken)
    private async listar(@queryParam("desde") desde: number,@requestParam("id") id: number, req: express.Request, res: express.Response, next: express.NextFunction) {
        let postulaciones = await this.postulacionService.listar(id, desde);
        return res.status(200).json({
            ok: true,
            postulaciones: postulaciones
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
    @httpPost("/postular",verificaToken, 
        body('solicitante','El Solicitante es oblidatorio').not().isEmpty(),
        body('vacante','La vacante es oblidatoria').not().isEmpty(),
        validarCampos
        )
    private async postularSolicitante(@request() req: express.Request, @response() res: express.Response) {

        
        try { 
            if(req.body.solicitante.ocupado === true) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Solicitante con un empleo activo',  
                });
            }
            const contratacion = this.contratacionService.buscarPorSolicitanteVacante(req.body.solicitante.id, req.body.vacante.id);
            if (contratacion) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error, Ya postulo para la vacante',  
                });
            }

            const buscar_postulacion = this.postulacionService.buscarPorSolicitanteVacante(req.body.solicitante.id, req.body.vacante.id);
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
                return res.status(500).json({
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

    @httpDelete("/eliminar/:id",verificaToken)  
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
            res.status(400).json({ 
                ok: false,  
                error: err.message 
            });  
        }
    }
    @httpGet("/listar-solicitante/:id",verificaToken)
    private async listarPorSolicitante(@queryParam("desde") desde: number,@requestParam("id") id: number, req: express.Request, res: express.Response, next: express.NextFunction) {
        let postulaciones = await this.postulacionService.listarPorSolicitante(id, desde);
        return res.status(200).json({
            ok: true,
            postulaciones: postulaciones
        });
    } 
}