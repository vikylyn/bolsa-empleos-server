import * as express from "express";
import { interfaces, controller, httpGet, httpPost, httpDelete, request, queryParam, response, requestParam, httpPut } from "inversify-express-utils";
import { inject } from "inversify";
import { TYPES } from "../config/types";
import { ICredencialesService } from '../interfaces/ICreadenciales.service';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IAdministradorService } from '../interfaces/IAdministrador.service';
import { SEED } from '../config/config';
import validarCampos from '../middlewares/administrador/validar-campos';

import { body } from 'express-validator';
import { ISolicitanteService } from '../interfaces/ISolicitante.service';
import { IEmpleadorService } from '../interfaces/IEmpleador.service';
import verificaToken from '../middlewares/verificar-token';
import { IEmpresaService } from '../interfaces/IEmpresa.service';
import { Empleador } from '../entity/empleador';
import { Empresa } from '../entity/empresa';

@controller("/login")    
export class LoginController implements interfaces.Controller {    
 
    constructor( @inject(TYPES.ICredencialesService) private credencialesService: ICredencialesService,
                 @inject(TYPES.IAdministradorService) private adminService: IAdministradorService,
                 @inject(TYPES.ISolicitanteService) private solicitanteService: ISolicitanteService,
                 @inject(TYPES.IEmpresaService) private empresaService: IEmpresaService,
                 @inject(TYPES.IEmpleadorService) private empleadorService: IEmpleadorService) {}
    
    @httpPost("/renovar",verificaToken)
        private renovarToken(@request() req: express.Request, @response() res: express.Response){
            let token = jwt.sign({ id: req.body.id }, SEED, {expiresIn: 14400 });
            return res.status(200).json({
                ok: true,
                token
            });
    }

    @httpPost("/",
            body('email', 'El email es obligatorio').isEmail(),
            body('password', 'El password es Obligatorio').not().isEmpty(),
            validarCampos
        )    
    private async login(@request() req: express.Request, @response() res: express.Response) {
        
        
        try {
            const credenciales = await this.credencialesService.buscarCredenciales(req.body.email);
            if (!credenciales){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Credenciales incorrectas - email',
                });
            }
            if( !bcrypt.compareSync(req.body.password,credenciales.password)){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Credenciales incorrectas - password'
                });
            }  
            credenciales.password = 'xd';
            let token = jwt.sign({ usuario: credenciales.email }, SEED, {expiresIn: 14400 }); // expira 4horas

            if(credenciales.rol.nombre === 'ROLE_ADMINISTRADOR') {
                    const admin = await this.adminService.buscarPorCredencial(credenciales.id);
                    if( admin.habilitado === false) {
                        return res.status(403).json({
                            ok: false,
                            mensaje: 'Cuenta de administrador inactiva'
                        }); 
                    }
                    admin.credenciales = credenciales;
                    console.log(admin);
                    return res.status(200).json({
                        ok: true,
                        usuario: admin,
                        token
                    });   
            }
            if(credenciales.rol.nombre === 'ROLE_SOLICITANTE') {
                const solicitante = await this.solicitanteService.buscarPorCredencial(credenciales.id);
                if( solicitante.habilitado === false) {
                    return res.status(403).json({
                        ok: false,
                        mensaje: 'Debe activar su cuenta ingresando al enlace enviado a su correo'
                    }); 
                }
                solicitante.credenciales = credenciales;
                return res.status(200).json({
                    ok: true,
                    usuario: solicitante,
                    token
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
                let empresa: Empresa = null;
                if(empleador.empresa){
                    empresa = await this.empresaService.buscarPorIdEmpleador(empleador.id);
                }
                empleador.credenciales = credenciales;
                console.log(empleador);
                return res.status(200).json({
                    ok: true,
                    token,
                    usuario: empleador,
                    empresa
                });   
            }
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
    } 
 
  
}