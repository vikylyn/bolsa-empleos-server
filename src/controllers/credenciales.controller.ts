import * as express from "express";
import { interfaces, controller, httpGet, httpPost, request, response, requestParam, httpPut, queryParam } from 'inversify-express-utils';
import { inject } from "inversify";
import { TYPES } from "../config/types";
import verificaToken from '../middlewares/verificar-token'
import validarCampos from '../middlewares/administrador/validar-campos';
import { body } from 'express-validator';
import { ICredencialesService } from '../interfaces/ICreadenciales.service';
import { Credenciales } from '../entity/credenciales';
import bcrypt from 'bcryptjs';
import { IAdministradorService } from '../interfaces/IAdministrador.service';
import { ISolicitanteService } from '../interfaces/ISolicitante.service';
import { IEmpleadorService } from '../interfaces/IEmpleador.service';
import { Solicitante } from '../entity/solicitante';
import { Administrador } from '../entity/administrador';
import { Empleador } from '../entity/empleador';
import { sendEmailAdministrador, sendEmailEmpleador, sendEmailSolicitante } from '../email/enviar-email';
import jwt from 'jsonwebtoken';
import { SEED } from '../config/config';

@controller("/credenciales")    
export class CredencialesController implements interfaces.Controller {    
 
    constructor(@inject(TYPES.ICredencialesService) private credencialesService: ICredencialesService,
                @inject(TYPES.IAdministradorService) private adminService: IAdministradorService,
                @inject(TYPES.ISolicitanteService) private solicitanteService: ISolicitanteService,
                @inject(TYPES.IEmpleadorService) private empleadorService: IEmpleadorService) {}
    
    // mover a un credencialesController

    @httpPut("/:id",
        verificaToken,
        body('password_antiguo', 'El password anterior es Obligatorio').not().isEmpty(),
        body('password_nuevo', 'El password nuevo es Obligatorio').not().isEmpty(),
        body('id_credenciales', 'El id de sus credenciales es Obligatorio').not().isEmpty(),

        validarCampos
        )  
    private async modificarPassword(@requestParam("id") id: number,@request() req: express.Request, @response() res: express.Response) {
        try {
            const credenciales: Credenciales = await this.credencialesService.buscarPorId(req.body.id_credenciales);
            if(credenciales){
                if( !bcrypt.compareSync(req.body.password_antiguo, credenciales.password)){
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Password antiguo incorrecto',
                        alerta: true
                    });
                }  
                const credencialModificado = await this.credencialesService.modificar(id,req.body.password_nuevo);
                if (credencialModificado.affected === 1){
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Credencales modificadas exitosamente',
                        alerta: false
                    });
                }else {
                    return res.status(400).json({
                        ok:false,
                        mensaje: 'Error al modificar credenciales',
                        alerta: false
                    });
                }
            }else {
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Error al modificar credenciales',
                });
            }
        } catch (err) {
            res.status(400).json({ 
                ok: false,  
                error: err.message });  
        }
    }
@httpPost("/email",
        body('email', 'El email es Obligatorio').not().isEmpty(),
        validarCampos
        )  
    private async enviarEmail(@request() req: express.Request, @response() res: express.Response) {
        try {
            const credenciales = await this.credencialesService.buscarCredenciales(req.body.email);
            if (!credenciales){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe ese email', 
                });
            }

            if(credenciales.rol.nombre === 'ROLE_ADMINISTRADOR') {
                    console.log('enviando Email administrador');

                    const admin: Administrador = await this.adminService.buscarPorCredencial(credenciales.id);
                    if( admin.habilitado === false) {
                        return res.status(403).json({
                            ok: false,
                            mensaje: 'Cuenta de administrador inactiva'
                        }); 
                    }
                    admin.credenciales = credenciales;
                    admin.credenciales.password = 'xd';
                   // enviar email
                   await sendEmailAdministrador(admin);

                   return res.status(200).json({
                    ok: false,
                    mensaje: 'Verifique su correo para restablecer su contraseña'
                });

            }
            if(credenciales.rol.nombre === 'ROLE_SOLICITANTE') {
                const solicitante: Solicitante = await this.solicitanteService.buscarPorCredencial(credenciales.id);
                if( solicitante.habilitado === false) {
                    return res.status(403).json({
                        ok: false,
                        mensaje: 'Debe activar su cuenta ingresando al enlace enviado a su correo'
                    }); 
                }
                solicitante.credenciales = credenciales;
                // enviar email y respuesta
                solicitante.credenciales = credenciales;
                solicitante.credenciales.password = 'xd';
               // enviar email
               await sendEmailSolicitante(solicitante, true);

               return res.status(200).json({
                ok: false,
                mensaje: 'Verifique su correo para restablecer su contraseña'
               }); 
            }
            if(credenciales.rol.nombre === 'ROLE_EMPLEADOR') {
                const empleador: Empleador = await this.empleadorService.buscarPorCredencial(credenciales.id);
                if( empleador.habilitado === false) {
                    return res.status(403).json({
                        ok: false,
                        mensaje: 'Debe activar su cuenta ingresando al enlace enviado a su correo'
                    }); 
                }
                // enviar email y respuesta
                empleador.credenciales = credenciales;
                empleador.credenciales.password = 'xd';
               // enviar email
               await sendEmailEmpleador(empleador, true);

               return res.status(200).json({
                ok: false,
                mensaje: 'Verifique su correo para restablecer su contraseña'
               });
            }
        } catch (err) {
            res.status(400).json({ 
                ok: false,  
                error: err.message });  
        }
    }
    // restablecer password olvidado
    @httpPut("/password/:id_credencial",
        verificaToken,
        body('password', 'El password nuevo es Obligatorio').not().isEmpty(),
        validarCampos
        )  
    private async restablecerPassword(@requestParam("id_credencial") id_credencial: number,@request() req: express.Request, @response() res: express.Response) {
        try {
            const credenciales: Credenciales = await this.credencialesService.buscarPorId(id_credencial);
            const token = req.query.token;
            jwt.verify( token.toString() , SEED, (err: any, decoded: any ) => {
                
                console.log('dentro de restablecer',decoded.usuario);
                if(decoded.usuario.credenciales.id != id_credencial) {
                    return res.status(403).json({
                        ok:false,
                        mensaje: 'Error al modificar credenciales',
                        alerta: false
                    });
                }
            });
            if(credenciales){
                const credencialModificado = await this.credencialesService.modificar(id_credencial,req.body.password);
                if (credencialModificado.affected === 1){
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Password restablecido exitosamente',
                        alerta: false
                    });
                }else {
                    return res.status(400).json({
                        ok:false,
                        mensaje: 'Error al modificar credenciales',
                        alerta: false
                    });
                }
            }else {
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Error al modificar credenciales',
                });
            }
        } catch (err) {
            res.status(400).json({ 
                ok: false,  
                error: err.message });  
        }
    }
 

 
  

}