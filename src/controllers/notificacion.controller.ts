import * as express from "express";
import { interfaces, controller, httpGet, httpPost, request, response, requestParam, httpPut, queryParam } from 'inversify-express-utils';
import { id, inject } from "inversify";
import { TYPES } from "../config/types";
import verificaToken from '../middlewares/verificar-token';
import { INotificacionEmpleadorService } from '../interfaces/notificacion-empleador.service';
import { INotificacionSolicitanteService } from '../interfaces/notificacion-solicitante.service';
import { NotificacionEmpleador } from '../entity/notificacion-empleador';
import { NotificacionSolicitante } from '../entity/notificacion-solicitante';

@controller("/notificacion")    
export class NotificacionController implements interfaces.Controller { 
    
    
    constructor( @inject(TYPES.INotificacionEmpleadorService) private notificacionEmpleadorService: INotificacionEmpleadorService,
                 @inject(TYPES.INotificacionSolicitanteService) private notificacionSolicitanteService: INotificacionSolicitanteService ) {}  
 
    @httpGet("/:id_usuario/:id_rol",verificaToken)
    private async listar(@requestParam("id_usuario") id_usuario: number,@requestParam("id_rol") id_rol: number,req: express.Request, res: express.Response, next: express.NextFunction) {

        if( 3 == id_rol) { 
            let notificaciones: NotificacionEmpleador[] = await this.notificacionEmpleadorService.listar(id_usuario);
            return res.status(200).json({
                ok: true,
                notificaciones,
            });
        }else {
            let notificaciones: NotificacionSolicitante[] = await this.notificacionSolicitanteService.listar(id_usuario);
            return res.status(200).json({
                ok: true,
                notificaciones,
            })
        }
    }
    @httpGet("/total/:id_usuario/:id_rol",verificaToken)
    private async contarNoLeidas(@requestParam("id_usuario") id_usuario: number,@requestParam("id_rol") id_rol: number,req: express.Request, res: express.Response, next: express.NextFunction) {
        if( 3 == id_rol) {
            let total: number = await this.notificacionEmpleadorService.contarNoLeidas(id_usuario);
            return res.status(200).json({
                ok: true,
                total,
            })
        }else {
            let total = await this.notificacionSolicitanteService.contarNoLeidas(id_usuario);
            return res.status(200).json({
                ok: true,
                total,
            })
        }
       
    }

    @httpPut("/:id_notificacion/:id_rol",verificaToken)
    private async leerNotificacion(@requestParam("id_notificacion") id_notificacion: number,@requestParam("id_rol") id_rol: number,req: express.Request, res: express.Response, next: express.NextFunction) {
        console.log('leer notificacion', id_notificacion, id_rol);
        if( 3 == id_rol) {
            let notificacion: any = await this.notificacionEmpleadorService.leerNotificacion(id_notificacion);
            if (notificacion.affected === 1){
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Notificacion marcada como leida'
                })
            }else {
                return res.status(400).json({
                    ok:false,
                     mensaje: 'Error al marcar como leida',
                });
            }
        }else {
            let notificacion: any = await this.notificacionSolicitanteService.leerNotificacion(id_notificacion);
            if (notificacion.affected === 1){
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Notificacion marcada como leida'
                })
            }else {
                return res.status(400).json({
                    ok:false,
                     mensaje: 'Error al marcar como leida',
                });
            }

        }
        
    }
    
  

 

}