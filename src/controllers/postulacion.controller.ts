import * as express from "express";
import { interfaces, controller, httpGet, httpPost, request, response, requestParam, httpPut, queryParam, httpDelete } from 'inversify-express-utils';
import { inject } from "inversify";
import { TYPES } from "../config/types";
import verificaToken from '../middlewares/verificar-token';
import validarCampos from '../middlewares/administrador/validar-campos';
import { body } from 'express-validator';
import { IPostulacionService } from '../interfaces/IPostulacion.service';
import { Postulacion } from '../entity/postulacion';
import { IContratacionService } from '../interfaces/IContratacion.service';
import { ISolicitanteService } from '../interfaces/ISolicitante.service';
import { Solicitante } from '../entity/solicitante';
import { Contratacion } from '../entity/contratacion';
import Server from '../classes/server';
import { INotificacionEmpleadorService } from '../interfaces/INotificacionEmpleador.service';
import { IEmpleadorService } from '../interfaces/IEmpleador.service';
import { Empleador } from '../entity/empleador';
import { usuariosConectados } from "../sockets/socket";
import { INotificacionSolicitanteService } from '../interfaces/INotificacionSolicitante.service';
import { IVacanteService } from '../interfaces/IVacante.service';
import { Vacante } from '../entity/vacante';
import { NotificacionSolicitante } from '../entity/notificacion-solicitante';

 
@controller("/postulacion")    
export class PostulacionController implements interfaces.Controller {  
 
    constructor( @inject(TYPES.IPostulacionService) private postulacionService: IPostulacionService,
                 @inject(TYPES.IContratacionService) private contratacionService: IContratacionService,
                 @inject(TYPES.INotificacionEmpleadorService) private notificacionEmpleadorService: INotificacionEmpleadorService,
                 @inject(TYPES.INotificacionSolicitanteService) private notificacionSolicitanteService: INotificacionSolicitanteService,
                 @inject(TYPES.IVacanteService) private vacanteService: IVacanteService,
                 @inject(TYPES.IEmpleadorService) private empleadorService: IEmpleadorService,
                 @inject(TYPES.ISolicitanteService) private solicitanteService: ISolicitanteService) {}  
 
    @httpGet("/lista-considerados/empleador/:id",verificaToken)
    private async listarConsideradosPorIdVacante(@queryParam("desde") desde: number,@requestParam("id") id: number, req: express.Request, res: express.Response, next: express.NextFunction) {
        let postulaciones = await this.postulacionService.listarConsideradosPorIdVacante(id, desde);
        let total = await this.postulacionService.contarConsideradosPorIdVacante(id);
        return res.status(200).json({
            ok: true,
            postulaciones: postulaciones,
            total
        });
    }  
    @httpGet("/lista-no-considerados/empleador/:id",verificaToken)
    private async listarNoConsideradosPorIdVacante(@queryParam("desde") desde: number,@requestParam("id") id: number, req: express.Request, res: express.Response, next: express.NextFunction) {
        let postulaciones = await this.postulacionService.listarNoConsideradosPorIdVacante(id, desde);
        let total = await this.postulacionService.contarNoConsideradosPorIdVacante(id);
        return res.status(200).json({
            ok: true,
            postulaciones: postulaciones,
            total
        });
    } 
    @httpGet("/lista-rechazados/empleador/:id",verificaToken)
    private async listarRechazadosPorIdVacante(@queryParam("desde") desde: number,@requestParam("id") id: number, req: express.Request, res: express.Response, next: express.NextFunction) {
        let postulaciones = await this.postulacionService.listarRechazadosPorIdVacante(id, desde);
        let total = await this.postulacionService.contarRechazadosPorIdVacante(id);
        return res.status(200).json({
            ok: true,
            postulaciones: postulaciones,
            total
        });
    } 
    @httpGet("/:id",verificaToken)
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
        body('id_empleador','El id del Empleador es oblidatorio').not().isEmpty(),
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
            const vacante: Vacante = await this.vacanteService.buscar(req.body.id_vacante);
            if(!vacante) {
                return res.status(400).json({
                    ok: false,
                    mensaje: `No existe una vacante con ese id ${req.body.id_vacante}`,  
                });
            }
            if (vacante.num_disponibles === 0){
                return res.status(400).json({
                    ok: false,
                    mensaje: `No existen vacantes disponibles`,  
                });
            }
  //          const contratacion: Contratacion = await this.contratacionService.buscarPorSolicitanteVacante(solicitante.id, req.body.id_vacante);
 /*           console.log('contratacion ', contratacion)
            if (contratacion) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error, Ya postulo para la vacante',  
                });
            }
*/
            const buscar_postulacion: Postulacion = await this.postulacionService.buscarPorSolicitanteVacante(solicitante.id, req.body.id_vacante);
            if (buscar_postulacion) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error, Ya postulo para la vacante',  
                });
            }
           

            const postulacion: Postulacion = await this.postulacionService.postularSolicitante(req.body); 
            if(postulacion) {
                const server = Server.instance;
                const empleador: Empleador = await this.empleadorService.buscar( req.body.id_empleador)
                if(empleador) {
                    const id_socket = usuariosConectados.getUsuarioByIdAndRol(empleador.id, empleador.credenciales.rol.nombre);
                    if(id_socket){
                        server.io.in(id_socket).emit('notificacion-nueva');
                        const totalNotificaciones: number = await this.notificacionEmpleadorService.contarNoLeidas(empleador.id)
                        server.io.in(id_socket).emit('total-no-leidas', totalNotificaciones);
                    }
                }
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
            console.log(err);
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
    @httpGet("/favoritos/:id",verificaToken)
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
            const postulacion:Postulacion = await this.postulacionService.buscar(id);
            if(postulacion){
                const postulacion_eliminada = await this.postulacionService.eliminar(postulacion);
                if (postulacion_eliminada === true){
                    const server = Server.instance;
                    const empleador: Empleador = await this.empleadorService.buscar(postulacion.vacante.empleador.id)
                    if(empleador) {
                        const id_socket = usuariosConectados.getUsuarioByIdAndRol(empleador.id, empleador.credenciales.rol.nombre);
                        if(id_socket){
                            server.io.in(id_socket).emit('notificacion-nueva');
                            server.io.in(id_socket).emit('actualizar-postulaciones', postulacion.id);
                            const totalNotificaciones: number = await this.notificacionEmpleadorService.contarNoLeidas(empleador.id)
                            server.io.in(id_socket).emit('total-no-leidas', totalNotificaciones);
                        }
                    }
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
            }else {
                return res.status(400).json({
                    ok:false,
                     mensaje: `Error al eliminar, no existe una postulacion con el ID ${id}`,
                });
            }


        } catch (err) {
            res.status(500).json({ 
                ok: false,  
                error: err.message 
            });  
        }
    }
    @httpPut("/aceptar/:id",verificaToken)
    private async aceptarSolicitante(@requestParam("id") id: number,@request() req: express.Request, @response() res: express.Response) {
      
    try {
        const postulacion: Postulacion = await this.postulacionService.buscar(id);
        if (!postulacion) {
            return res.status(400).json({
                ok: false,
                mensaje:`No existe una postulacion con el ID ${id}`
            });
        }
        if (postulacion.solicitante.ocupado){
            return res.status(400).json({
                ok: false,
                mensaje:`el solicitante tiene  un empleo asignado`
            });
        }
        if (postulacion.vacante.num_disponibles === 0) {
            return res.status(400).json({
                ok: false,
                mensaje:`Numero de vacantes disponibles es cero`
            });
        }
        const postulacion_aceptada = await this.postulacionService.aceptarSolicitante(postulacion);
        if (postulacion_aceptada) {
            const server = Server.instance;
            const solicitante: Solicitante = await this.solicitanteService.buscar(postulacion.solicitante.id);
            const id_socket = usuariosConectados.getUsuarioByIdAndRol(solicitante.id, solicitante.credenciales.rol.nombre);
            if(id_socket){
                server.io.in(id_socket).emit('notificacion-nueva');
                server.io.in(id_socket).emit('verificar-postulacion');
                const totalNotificaciones: number = await this.notificacionSolicitanteService.contarNoLeidas(solicitante.id)
                server.io.in(id_socket).emit('total-no-leidas', totalNotificaciones);
            }
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
    @httpPut("/aceptar-rechazado/:id",verificaToken)
    private async aceptarRechazado(@requestParam("id") id: number,@request() req: express.Request, @response() res: express.Response) {
      
    try {
        const postulacion: Postulacion = await this.postulacionService.buscar(id);
        if (!postulacion) {
            return res.status(400).json({
                ok: false,
                mensaje:`No existe una postulacion con el ID ${id}`
            });
        }
/*        if (postulacion.solicitante.ocupado){
            return res.status(400).json({
                ok: false,
                mensaje:`el solicitante tiene  un empleo asignado`
            });
        }
*/
        if (postulacion.vacante.num_disponibles === 0) {
            return res.status(400).json({
                ok: false,
                mensaje:`Numero de vacantes disponibles es cero`
            });
        }
        const postulacion_aceptada = await this.postulacionService.aceptarRechazado(postulacion);
        if (postulacion_aceptada) {
            const server = Server.instance;
            const solicitante: Solicitante = await this.solicitanteService.buscar(postulacion.solicitante.id);
            const id_socket = usuariosConectados.getUsuarioByIdAndRol(solicitante.id, solicitante.credenciales.rol.nombre);
            if(id_socket){
                server.io.in(id_socket).emit('notificacion-nueva');
                server.io.in(id_socket).emit('verificar-postulacion');
                const totalNotificaciones: number = await this.notificacionSolicitanteService.contarNoLeidas(solicitante.id)
                server.io.in(id_socket).emit('total-no-leidas', totalNotificaciones);
            }
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
    @httpPut("/rechazar/:id",verificaToken)  
    private async rechazar(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const postulacion:Postulacion = await this.postulacionService.buscar(id);
            if(postulacion){
                const postulacion_eliminada = await this.postulacionService.rechazar(postulacion);
                console.log(postulacion_eliminada, postulacion)
                if (postulacion_eliminada){
                    const server = Server.instance;
                    const solicitante: Solicitante = await this.solicitanteService.buscar(postulacion.solicitante.id);
                    const id_socket = usuariosConectados.getUsuarioByIdAndRol(solicitante.id, solicitante.credenciales.rol.nombre);
                    if(id_socket){
                        server.io.in(id_socket).emit('notificacion-nueva');
                        const totalNotificaciones: number = await this.notificacionSolicitanteService.contarNoLeidas(solicitante.id)
                        server.io.in(id_socket).emit('total-no-leidas', totalNotificaciones);
                    }
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
            }else {
                return res.status(400).json({
                    ok:false,
                     mensaje: `Error al eliminar, no existe una postulacion con el ID ${id}`,
                });
            }
           

        } catch (err) {
            res.status(500).json({ 
                ok: false,  
                error: err.message 
            });  
        }
    }
    @httpPut("/confirmar/:id",verificaToken)
    private async confirmar(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const postulacion: Postulacion = await this.postulacionService.buscar(id);
            if (!postulacion) {
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe una postulacion con el ID ${id}`
                });
            }
            if(postulacion.solicitante.ocupado) {
                return res.status(400).json({
                    ok: false,
                    mensaje:`Ya tiene un empleo asignado, no puede confirmar otro`
                });
            }
            const contratacion = await this.postulacionService.confirmar(postulacion);
            if(contratacion) { 
                const server = Server.instance;
                const empleador: Empleador = await this.empleadorService.buscar(postulacion.vacante.empleador.id);
                if(empleador) {
                    const id_socket = usuariosConectados.getUsuarioByIdAndRol(empleador.id, empleador.credenciales.rol.nombre);
                    if(id_socket){
                        server.io.in(id_socket).emit('notificacion-nueva');
                        server.io.in(id_socket).emit('actualizar-postulaciones', postulacion.id);
                        const totalNotificaciones: number = await this.notificacionEmpleadorService.contarNoLeidas(empleador.id)
                        server.io.in(id_socket).emit('total-no-leidas', totalNotificaciones);
                    }
                }
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
    @httpGet("/lista-pendientes/solicitante/:id",verificaToken)
    private async listarPendientesPorIdSolicitante(@queryParam("desde") desde: number,@requestParam("id") id: number, req: express.Request, res: express.Response, next: express.NextFunction) {
        let postulaciones: Postulacion[] = await this.postulacionService.listarPendientesPorIdSolicitante(id, desde);
        let total = await this.postulacionService.contarPendientesPorIdSolicitante(id);

        return res.status(200).json({
            ok: true,
            postulaciones: postulaciones,
            total
        });
    } 
    @httpGet("/lista-considerados/solicitante/:id",verificaToken)
    private async listarConsideradosPorIdSolicitante(@queryParam("desde") desde: number,@requestParam("id") id: number, req: express.Request, res: express.Response, next: express.NextFunction) {
        let postulaciones: Postulacion[] = await this.postulacionService.listarConsideradosPorIdSolicitante(id, desde);
        let total = await this.postulacionService.contarConsideradosPorIdSolicitante(id);

        return res.status(200).json({
            ok: true,
            postulaciones: postulaciones,
            total
        });
    } 
    @httpGet("/lista-rechazados/solicitante/:id",verificaToken)
    private async listarRechazadosPorSolicitante(@queryParam("desde") desde: number,@requestParam("id") id: number, req: express.Request, res: express.Response, next: express.NextFunction) {
        let postulaciones: Postulacion[] = await this.postulacionService.listarRechazadosPorSolicitante(id, desde);
        let total = await this.postulacionService.contarRechazadosPorIdSolicitante(id);

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
            if (contratacion) {
                return res.status(200).json({
     /*               ocupado: solicitante.ocupado,
                    contratado: true,
                    postulando: false,
                    aceptado: true,
                    contratacion
*/
                    ocupado: solicitante.ocupado,
                    postulacion: null,
                    contratacion
                });
            }

            const postulacion: Postulacion = await this.postulacionService.buscarPorSolicitanteVacante(solicitante.id, id_vacante);
            if (postulacion) {
                return res.status(200).json({
                    ocupado: solicitante.ocupado,
                    contratacion: null,
                    postulacion,

             /*       ocupado: solicitante.ocupado,
                    contratado: false,
                    postulando: true,
                 //   postulando: false,
                    aceptado: postulacion.aceptado,
                    postulacion: postulacion,
            */
                });
            }else {
                return res.status(200).json({
                    ocupado: solicitante.ocupado,
                    portulacion: null,
                    contratacion: null

              /*      ocupado: solicitante.ocupado,
                    postulando: false,
                //    postulando: true,
                    contratado: false,
                    aceptado: false,
            */
                });
            }
        
        } catch (err) {
            res.status(500).json({
                ok: false, 
                error: err.message 
             });
        }
    } 

    @httpGet("/busqueda/:id/:valor",verificaToken)
    private async busqueda(@requestParam("valor") valor: string,@requestParam("id") idEmpleador: number, @response() res: express.Response, next: express.NextFunction) {
        try {
            const postulaciones = await this.postulacionService.busqueda(valor,idEmpleador);
            if (!postulaciones){
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existen postulaciones con este parametro ${valor}`
            });
            }  
            return res.status(200).json({
                ok: true, 
                postulaciones,
            });
        } catch (err) {
            res.status(400).json({ 
                ok: false,
                error: err.message });
        }
    }

        @httpPost("/invitacion",verificaToken, 
        body('id_solicitante','El id del Solicitante es oblidatorio').not().isEmpty(),
        body('id_empleador','El id del Empleador es oblidatorio').not().isEmpty(),
        body('id_vacante','El id de la vacante es oblidatorio').not().isEmpty(),
        validarCampos
        )
    private async invitarPostulacion(@request() req: express.Request, @response() res: express.Response) {

        
        try { 
            const solicitante: Solicitante = await this.solicitanteService.buscar(req.body.id_solicitante);
            if(!solicitante) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'no existe un solicitante con ese id',  
                });
            }
        
            const vacante: Vacante = await this.vacanteService.buscar(req.body.id_vacante);
            if(!vacante) {
                return res.status(400).json({
                    ok: false,
                    mensaje: `No existe una vacante con ese id ${req.body.id_vacante}`,  
                });
            }
            if (vacante.num_disponibles === 0){
                return res.status(400).json({
                    ok: false,
                    mensaje: `No existen vacantes disponibles`,  
                });
            }
            const invitacion = await this.notificacionSolicitanteService.buscarPorIdSolicitanteVacanteTipoNotificacion(solicitante.id, vacante.id,7);
            if(invitacion) {
                return res.status(400).json({
                    ok: false,
                    mensaje: `Ya se envio un invitacion a ${solicitante.nombre} ${solicitante.apellidos}`,  
                });
            }
            const invitar: boolean = await this.postulacionService.invitarPostulacion(req.body);
            if (invitar === true) {
                const server = Server.instance;
                const id_socket = usuariosConectados.getUsuarioByIdAndRol(solicitante.id, solicitante.credenciales.rol.nombre);
                if(id_socket){
                    server.io.in(id_socket).emit('notificacion-nueva');
                    const totalNotificaciones: number = await this.notificacionSolicitanteService.contarNoLeidas(solicitante.id)
                    server.io.in(id_socket).emit('total-no-leidas', totalNotificaciones);
                }
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Invitacion realizada exitosamente',  
                });
            }else {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al invitar a postularse', 
                });
            }   
           
        } catch (err) {
            console.log(err);
            res.status(500).json({
                ok: false, 
                error: err.message 
             });
        }
    } 
    @httpGet("/invitacion/:id_solicitante/:id_vacante",verificaToken,validarCampos)
    private async buscarInvitacion(@requestParam("id_solicitante") id_solicitante: number, @requestParam("id_vacante") id_vacante: number,@request() req: express.Request, @response() res: express.Response) {

        
        try { 
            const solicitante: Solicitante = await this.solicitanteService.buscar(id_solicitante);
            if(!solicitante) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'no existe un solicitante con ese id',  
                });
            }
        
            const vacante: Vacante = await this.vacanteService.buscar(id_vacante);
            if(!vacante) {
                return res.status(400).json({
                    ok: false,
                    mensaje: `No existe una vacante con ese id ${req.body.id_vacante}`,  
                });
            }
            const notificacion: NotificacionSolicitante = await this.notificacionSolicitanteService.buscarPorIdSolicitanteVacanteTipoNotificacion(id_solicitante, id_vacante,7);
            if(notificacion) {
                return res.status(200).json({
                    ok: true,
                    notificacion,  
                });
            }else {
                return res.status(400).json({
                    ok: false,
                    mensaje: `No existe una invitacion`,
                    notificacion: null,  
                })
            }
           
           
        } catch (err) {
            console.log(err);
            res.status(500).json({
                ok: false, 
                error: err.message 
             });
        }
    } 
}