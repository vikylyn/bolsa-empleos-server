import * as express from "express";
import { interfaces, controller, httpGet, httpPost, request, response, requestParam, httpPut, queryParam, httpDelete } from 'inversify-express-utils';
import { id, inject } from "inversify";
import { TYPES } from "../config/types";
import verificaToken from '../middlewares/verificar-token';
import { INotificacionEmpleadorService } from '../interfaces/INotificacionEmpleador.service';
import { INotificacionSolicitanteService } from '../interfaces/INotificacionSolicitante.service';
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
    
    @httpGet("/buscar/:id_notificacion/:id_rol",verificaToken)
    private async buscar(@requestParam("id_notificacion") id_notificacion: number,@requestParam("id_rol") id_rol: number,req: express.Request, res: express.Response, next: express.NextFunction) {

        if( 3 == id_rol) { 
            let notificacion: NotificacionEmpleador = await this.notificacionEmpleadorService.buscar(id_notificacion);
            if(!notificacion) {
                return res.status(400).json({
                    ok: false,
                    mensaje: `No existe una notificacion con el id ${id_notificacion}`,
                });
            }
            return res.status(200).json({
                ok: true,
                notificacion,
            });
        }else {
            let notificacion: NotificacionSolicitante = await this.notificacionSolicitanteService.buscar(id_notificacion);
            if(!notificacion) {
                return res.status(400).json({
                    ok: false,
                    mensaje: `No existe una notificacion con el id ${id_notificacion}`,
                });
            }
            return res.status(200).json({
                ok: true,
                notificacion,
            })
        }
    }

    @httpDelete("/:id_notificacion/:id_rol",verificaToken)
    private async eliminar(@requestParam("id_notificacion") id_notificacion: number,@requestParam("id_rol") id_rol: number,req: express.Request, res: express.Response, next: express.NextFunction) {

        if( 3 == id_rol) { 
            let notificacion: NotificacionEmpleador = await this.notificacionEmpleadorService.buscar(id_notificacion);
            if(!notificacion) {
                return res.status(400).json({
                    ok: false,
                    mensaje: `No existe una notificacion con el id ${id_notificacion}`,
                });
            }
            let notificacion_eliminada = await this.notificacionEmpleadorService.eliminar(id_notificacion);
            if (notificacion_eliminada === true) {
                return res.status(200).json({
                    ok: true,
                    mensaje: `Notificacion eliminada exitosamente`
                });
            }else {
                return res.status(400).json({
                    ok: true,
                    mensaje: `No se pudo eliminar la notificacion`
                })
            }

        }else {
            let notificacion: NotificacionSolicitante = await this.notificacionSolicitanteService.buscar(id_notificacion);
            if(!notificacion) {
                return res.status(400).json({
                    ok: false,
                    mensaje: `No existe una notificacion con el id ${id_notificacion}`,
                });
            }
            let notificacion_eliminada = await this.notificacionSolicitanteService.eliminar(id_notificacion);
            if (notificacion_eliminada === true) {
                return res.status(200).json({
                    ok: true,
                    mensaje: `Notificacion eliminada exitosamente`
                });
            }else {
                return res.status(400).json({
                    ok: true,
                    mensaje: `No se pudo eliminar la notificacion`
                })
            }
        }
    }
    @httpGet("/paginacion/:id_usuario/:id_rol/:desde",verificaToken)
    private async listarConPaginacion(@requestParam("id_usuario") id_usuario: number,@requestParam("id_rol") id_rol: number,
        @requestParam("desde") desde: number,req: express.Request, res: express.Response, next: express.NextFunction) {

        if( 3 == id_rol) { 
            let notificaciones: NotificacionEmpleador[] = await this.notificacionEmpleadorService.listarConPaginacion(id_usuario,desde);
            let totalNoLeidas = await this.notificacionEmpleadorService.contarNoLeidas(id_usuario);
            let total = await this.notificacionEmpleadorService.contarTodas(id_usuario);
            return res.status(200).json({
                ok: true,
                notificaciones,
                totalNoLeidas,
                total
            });
        }else {
            let notificaciones: NotificacionSolicitante[] = await this.notificacionSolicitanteService.listarConPaginacion(id_usuario,desde);
            let totalNoLeidas = await this.notificacionSolicitanteService.contarNoLeidas(id_usuario);
            let total = await this.notificacionSolicitanteService.contarTodas(id_usuario);
            return res.status(200).json({
                ok: true,
                notificaciones,
                totalNoLeidas,
                total
            })
        }
    }
} 