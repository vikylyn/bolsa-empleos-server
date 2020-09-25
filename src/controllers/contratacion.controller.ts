import * as express from "express";
import { interfaces, controller, httpGet, httpPost, request, response, requestParam, httpPut, queryParam, httpDelete } from 'inversify-express-utils';
import { inject } from "inversify";
import { TYPES } from "../../config/types";
import verificaToken from '../middlewares/verificar-token'
import { IContratacionService } from '../interfaces/contratacion.service';
import { IPostulacionService } from '../interfaces/postulacion.service';
import { Postulacion } from '../entity/postulacion';
import { Contratacion } from '../entity/contratacion';

@controller("/contratacion")      
export class ContratacionController implements interfaces.Controller {    
 
    constructor( @inject(TYPES.IContratacionService) private contratacionService: IContratacionService,
                 @inject(TYPES.IPostulacionService) private postulacionService: IPostulacionService
     ) {}
 
    @httpGet("/listar/:id",verificaToken)
     private async listar(@queryParam("desde") desde: number,@requestParam("id") id: number, req: express.Request, res: express.Response, next: express.NextFunction) {
         let contrataciones = await this.contratacionService.listar(id, desde);
         return res.status(200).json({
             ok: true,
             contrataciones
         });
    }
    @httpGet("/listar-confirmados/:id",verificaToken)
    private async listarConfirmados(@queryParam("desde") desde: number,@requestParam("id") id: number, req: express.Request, res: express.Response, next: express.NextFunction) {
        let contrataciones = await this.contratacionService.listarConfirmados(id, desde);
        return res.status(200).json({
            ok: true,
            contrataciones
        });
    }
    @httpPut("/confirmar/:id",verificaToken)
    private async buscar(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const postulacion: Postulacion = await this.postulacionService.buscar(id);
            if (!postulacion) {
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe una postulacion con el ID ${id}`
                });
            }
            const contratacion = await this.contratacionService.confirmarContrato(postulacion);
            if(contratacion.affected === 1) { 
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Confirmacion exitosamente',  
                    contratacion
                });
            }else {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al confirmar  contratacion', 
                });
            }
        } catch (err) {
            res.status(400).json({
                ok: false, 
                error: err.message 
            });
        }
    } // 
    @httpPut("/desvincular/:id",verificaToken)
    private async desvincularSolicitante(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const contratacion: Contratacion = await this.contratacionService.buscar(id);
            if (!contratacion) { 
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe una contratacion con el ID ${id}`
                });
            }
            const desvinculacion = await this.contratacionService.desvincularSolicitante(contratacion);
            if(desvinculacion.affected === 1) {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Desvinculacion exitosamente'
                });
            }else {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al devincular Solicitante', 
                });
            }
        } catch (err) {
            res.status(400).json({
                ok: false, 
                error: err.message 
            });
        }
    } //

    @httpDelete("/eliminar/:id",verificaToken)  
    private async eliminar(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const contratacion: Contratacion = await this.contratacionService.buscar(id);
            if (!contratacion) { 
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe una contratacion con el ID ${id}`
                });
            }
            if (contratacion.vacante.num_disponibles === contratacion.vacante.num_vacantes) {
                return res.status(400).json({
                    ok: false,
                    mensaje:`Existe un numero de vacantes igual al numero de disponibles ${id}`
                }); 
            }
            if (contratacion.confirmado === true) {
                return res.status(400).json({
                    ok: false,
                    mensaje:`Error al borrar, la contratacion ha sido confirmada`
                }); 
            }
            const contratacion_eliminada = await this.contratacionService.eliminar(contratacion);
            if (contratacion_eliminada){
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Contratacion eliminada exitosamente',
                    contratacion_eliminada
                })
            }else {
                return res.status(400).json({
                    ok:false,
                     mensaje: 'Error al eliminar contratacion',
                });
            }

        } catch (err) {
            res.status(400).json({ 
                ok: false,  
                error: err.message 
            });  
        }
    }
    @httpDelete("/rechazar/:id",verificaToken)  
    private async rechazar(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const postulacion: Postulacion = await this.postulacionService.buscar(id);
            if (!postulacion) { 
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe una postulacion con el ID ${id}`
                });
            }
            if (postulacion.vacante.num_disponibles === postulacion.vacante.num_vacantes) {
                return res.status(400).json({
                    ok: false,
                    mensaje:`Error, Existe un numero de vacantes igual al numero de disponibles ${id}`
                }); 
            }
            if (postulacion.aceptado === false) {
                return res.status(400).json({
                    ok: false,
                    mensaje:`Error al borrar, No  ha sido aceptado para la vacante`
                }); 
            }
            const contratacion_rechazada = await this.contratacionService.rechazar(postulacion);
            if (contratacion_rechazada.affected === 1){
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Contratacion rechazada exitosamente',
                })
            }else {
                return res.status(400).json({
                    ok:false,
                     mensaje: 'Error al rechazar contratacion'                
                    });
            }

        } catch (err) {
            res.status(400).json({ 
                ok: false,  
                error: err.message 
            });  
        }
    }
    @httpPost("/aceptar/:id",
        verificaToken
    )
    private async aceptarSolicitante(@requestParam("id") id: number,@request() req: express.Request, @response() res: express.Response) {
      
    try {
        const postulacion = await this.postulacionService.buscar(id);
        if (!postulacion) {
            return res.status(400).json({
                ok: false,
                mensaje:`No existe una postulacion con el ID ${id}`
            });
        }
        if (postulacion.vacante.num_disponibles === 0) {
            return res.status(400).json({
                ok: false,
                mensaje:`Numero de vacantes disponibles es cero`
            });
        }
        const contratacion = await this.contratacionService.aceptarSolicitante(postulacion);
        if (contratacion) {
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
}