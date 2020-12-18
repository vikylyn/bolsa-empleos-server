import * as express from "express";
import { interfaces, controller, httpGet, httpPost, request, response, requestParam, httpPut, queryParam, httpDelete } from 'inversify-express-utils';
import { inject } from "inversify";
import { TYPES } from "../config/types";
import verificaToken from '../middlewares/verificar-token'
import { IContratacionService } from '../interfaces/IContratacion.service';
import { IPostulacionService } from '../interfaces/IPostulacion.service';
import { Postulacion } from '../entity/postulacion';
import { Contratacion } from '../entity/contratacion';
import Server from '../classes/server';
import { usuariosConectados } from '../sockets/socket';
import { ISolicitanteService } from '../interfaces/ISolicitante.service';
import { INotificacionSolicitanteService } from '../interfaces/INotificacionSolicitante.service';
import { INotificacionEmpleadorService } from '../interfaces/INotificacionEmpleador.service';
import { IEmpleadorService } from '../interfaces/IEmpleador.service';
import { Empleador } from '../entity/empleador';
import { Solicitante } from '../entity/solicitante';

@controller("/contratacion")      
export class ContratacionController implements interfaces.Controller {    
 
    constructor( @inject(TYPES.IContratacionService) private contratacionService: IContratacionService,
                 @inject(TYPES.IPostulacionService) private postulacionService: IPostulacionService,
                 @inject(TYPES.ISolicitanteService) private solicitanteService: ISolicitanteService,
                 @inject(TYPES.IEmpleadorService) private empleadorService: IEmpleadorService,
                 @inject(TYPES.INotificacionEmpleadorService) private notificacionEmpleadorService: INotificacionEmpleadorService,
                 @inject(TYPES.INotificacionSolicitanteService) private notificacionSolicitanteService: INotificacionSolicitanteService
     ) {}
 
     @httpGet("/:id",verificaToken)
     private async buscar(@requestParam("id") id: number, @response() res: express.Response) {
         try {
             const contratacion: Contratacion = await this.contratacionService.buscar(id);
             if (!contratacion) { 
                 return res.status(400).json({
                     ok: false,
                     mensaje:`No existe una contratacion con el ID ${id}`
                 });
             }
            return res.status(200).json({
                ok: true,
                contratacion
            });
         } catch (err) {
             res.status(400).json({
                 ok: false, 
                 error: err.message 
             });
         }
     } //
    @httpGet("/lista/:id",verificaToken)
     private async listar(@queryParam("desde") desde: number,@requestParam("id") id_vacante: number, req: express.Request, res: express.Response, next: express.NextFunction) {
         let contrataciones = await this.contratacionService.listarPorIdVacante(id_vacante, desde);
         let total = await this.contratacionService.contarPorIdVacante(id_vacante);
         return res.status(200).json({
             ok: true,
             contrataciones,
             total
         });
    }
    @httpGet("/lista-solicitante/:id",verificaToken)
    private async listarPorIdSolicitante(@queryParam("desde") desde: number,@requestParam("id") id: number, req: express.Request, res: express.Response, next: express.NextFunction) {
        let contrataciones = await this.contratacionService.listarPorIdSolicitante(id, desde);
        let total = await this.contratacionService.contarPorIdSolicitante(id);
        return res.status(200).json({
            ok: true,
            contrataciones,
            total
        });
    }
    @httpGet("/lista-empleador/:id",verificaToken)
    private async listarPorIdEmpleador(@queryParam("desde") desde: number,@requestParam("id") id: number, req: express.Request, res: express.Response, next: express.NextFunction) {
        let contrataciones = await this.contratacionService.listarPorIdEmpleador(id, desde);
        let total = await this.contratacionService.contarPorIdEmpleador(id);
        return res.status(200).json({
            ok: true,
            contrataciones,
            total
        });
    }
    @httpPut("/desvincular/:id",verificaToken)
    private async desvincularSolicitante(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const contratacion: Contratacion = await this.contratacionService.buscar(id);
            console.log(contratacion);
            if (!contratacion) { 
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe una contratacion con el ID ${id}`
                });
            }
            const desvinculacion = await this.contratacionService.desvincularSolicitante(contratacion);
            console.log(desvinculacion);
            if(desvinculacion) {
                const solicitante: Solicitante = await this.solicitanteService.buscar(contratacion.solicitante.id);
                if(solicitante) {
                    const server = Server.instance;
                    const id_socket = usuariosConectados.getUsuarioByIdAndRol(solicitante.id, solicitante.credenciales.rol.nombre);
                    if(id_socket){
                        server.io.in(id_socket).emit('notificacion-nueva');
                        const totalNotificaciones: number = await this.notificacionSolicitanteService.contarNoLeidas(solicitante.id)
                        server.io.in(id_socket).emit('total-no-leidas', totalNotificaciones);
                    }
                }
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
            if (contratacion_rechazada === true){
                const server = Server.instance;
                const empleador: Empleador = await this.empleadorService.buscar(postulacion.vacante.empleador.id);
                const id_socket = usuariosConectados.getUsuarioByIdAndRol(empleador.id, empleador.credenciales.rol.nombre);
                if(id_socket){
                    server.io.in(id_socket).emit('notificacion-nueva');
                    server.io.in(id_socket).emit('actualizar-postulaciones', postulacion.id);
                    const totalNotificaciones: number = await this.notificacionEmpleadorService.contarNoLeidas(empleador.id)
                    server.io.in(id_socket).emit('total-no-leidas', totalNotificaciones);
                }
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
    @httpPut("/oculto/:id",verificaToken)
    private async ocultar(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const contratacion: Contratacion = await this.contratacionService.buscar(id);
            if (!contratacion) { 
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe una contratacion con el ID ${id}`
                });
            }
            const contratacion_modificada = await this.contratacionService.ocultar(contratacion);
            if (contratacion_modificada){
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Contratacion eliminada exitosamente',
                })
            }else {
                return res.status(400).json({
                    ok:false,
                     mensaje: 'Error al eliminar contratacion'                
                    });
            }

        } catch (err) {
            res.status(400).json({ 
                ok: false,  
                error: err.message 
            });  
        }
    }

    @httpGet("/busqueda/:id/:valor",verificaToken)
    private async busqueda(@requestParam("valor") valor: string,@requestParam("id") idEmpleador: number, @response() res: express.Response, next: express.NextFunction) {
        try {
            const contrataciones = await this.contratacionService.busqueda(valor,idEmpleador);
            if (!contrataciones){
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existen contrataciones con este parametro ${valor}`
            });
            }  
            return res.status(200).json({
                ok: true, 
                contrataciones,
            });
        } catch (err) {
            res.status(500).json({ 
                ok: false,
                error: err.message });
        }
    }
}