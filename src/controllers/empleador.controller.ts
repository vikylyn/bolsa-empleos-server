import * as express from "express";
import { interfaces, controller, httpGet, httpPost, request, response, requestParam, httpPut, queryParam } from 'inversify-express-utils';
import { inject } from "inversify";
import { TYPES } from "../config/types";
import verificaToken from '../middlewares/verificar-token';
import validarCampos from '../middlewares/administrador/validar-campos';
import { body } from 'express-validator';
import { ICredencialesService } from '../interfaces/ICreadenciales.service';

import { sendEmailEmpleador } from '../email/enviar-email';
import { IEmpleadorService } from '../interfaces/IEmpleador.service';
import { Empleador } from '../entity/empleador';
import { IEmpresaService } from '../interfaces/IEmpresa.service';
import { IInformacionAppService } from '../interfaces/IInformacionApp.service';




@controller("/empleador")    
export class EmpleadorController implements interfaces.Controller {    
 
    constructor( @inject(TYPES.IEmpleadorService) private empleadorService: IEmpleadorService,
                 @inject(TYPES.IEmpresaService) private empresaService: IEmpresaService,
                 @inject(TYPES.IInformacionAppService) private informacionAppService: IInformacionAppService,
                 @inject(TYPES.ICredencialesService) private credencialesService: ICredencialesService
     ) {}
 
    @httpGet("/",verificaToken)
    private async listar(@queryParam("desde") desde: number, req: express.Request, res: express.Response, next: express.NextFunction) {
        let empleadores: Empleador[] = await this.empleadorService.listar(desde);
        return res.status(200).json({
            ok: true,
            empleadores: empleadores
        });
    } 
    @httpGet("/:id",verificaToken)
    private async buscar(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const empleador: Empleador = await this.empleadorService.buscar(id);
            if (!empleador){
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe un empleador con el ID ${id}`
                });
            }
           
            return res.status(200).json({
                ok: true,
                empleador: empleador,
            });
        } catch (err) {
            res.status(500).json({
                ok: false, 
                error: err.message });
        }
    }
    @httpPost("/",
    body('nombre','El nombre es oblidatorio').not().isEmpty(),
    body('apellidos','Los apellidos son obligatorios').not().isEmpty(),
    body('telefono','El telefono es obigatorio').not().isEmpty(),
    body('cedula','La cedula es obligatoria').not().isEmpty(),
    body('genero', 'El genero es obligatorio').not().isEmpty(),
    body('nacionalidad', 'La Nacionalidad es obligatoria').not().isEmpty(),
    body('direccion', 'La direccion es obligatoria').not().isEmpty(),
    body('id_ciudad', 'El id de la ciudad es obligatorio').not().not().isEmpty(),
    body('email', 'El email es obligatorio').isEmail(),
    body('password', 'El password es Obligatorio').not().isEmpty(),
    body('id_rol', 'El id del Rol es obligatorio').not().isEmpty(),
    body('empresa', 'El valor boleano para la existencia de una empresa es obligatorio').not().isEmpty(),
    validarCampos
    )
private async adicionar(@request() req: express.Request, @response() res: express.Response) {


    try {
        const existe_email = await this.credencialesService.buscarCredenciales(req.body.email);
        const informacionApp = await this.informacionAppService.buscar(1);
        if (existe_email) {
            return res.status(500).json({
                ok: false, 
                mensaje: 'Existe un usuario con ese email'
             })
        }
        
        const empleador = await this.empleadorService.adicionarEmpleador(req.body);
        
       
     
        if (empleador) {
        
            await sendEmailEmpleador(empleador,informacionApp);

            return res.status(201).json({
                ok: true,
                mensaje: 'Empleador adicionado exitosamente',  
                //empleador: empleador
            });
        } else {
            return res.status(400).json({
                ok: true,
                mensaje: 'Error al adicionar Empleador',  
                // solicitante: solicitante
            });
        }
             
    } catch (err) {
        res.status(500).json({
            ok: false, 
            error: err.message 
         });
    }
} 
    @httpPost("/empresa/",
        body('nombre','El nombre es oblidatorio').not().isEmpty(),
        body('apellidos','Los apellidos son obligatorios').not().isEmpty(),
        body('telefono','El telefono es obigatorio').not().isEmpty(),
        body('cedula','La cedula es obligatoria').not().isEmpty(),
        body('genero', 'El genero es obligatorio').not().isEmpty(),
        body('nacionalidad', 'La Nacionalidad es obligatoria').not().isEmpty(),
        body('direccion', 'La direccion es obligatoria').not().isEmpty(),
        body('id_ciudad', 'El id de la ciudad es obligatorio').not().not().isEmpty(),
        body('email', 'El email es obligatorio').isEmail(),
        body('password', 'El password es Obligatorio').not().isEmpty(),
        body('id_rol', 'El id del Rol es obligatorio').not().isEmpty(),
        body('empresa', 'El valor boleano para la existencia de una empresa es obligatorio').not().isEmpty(),
        body('empresa_nombre', 'El nombre de la empresa es obligatorio').not().isEmpty(),
        body('id_razon_social', 'El id de la razon social es obligatorio').not().isEmpty(),
        body('empresa_direccion', 'La direccion de la empresa es obligatorio').not().isEmpty(),
        body('empresa_telefono', 'El telefono de la empresa es obligatorio').not().isEmpty(),
        body('empresa_descripcion', 'La descripcion de la empresa es obligatorio').not().isEmpty(),
        body('empresa_id_ciudad', 'El id de la ciudad es obligatorio').not().isEmpty(),
        validarCampos
        )
    private async adicionarEmpleadorEmpresa(@request() req: express.Request, @response() res: express.Response) {

    
        try {
            const existe_email = await this.credencialesService.buscarCredenciales(req.body.email);
            const informacionApp = await this.informacionAppService.buscar(1);
            if (existe_email) {
                return res.status(400).json({
                    ok: false, 
                    mensaje: 'Existe un usuario con ese email'
                 })
            }
            
            const empleador = await this.empleadorService.adicionarEmpleadorEmpresa(req.body);
                     
            if (empleador) {
            
                sendEmailEmpleador(empleador,informacionApp);
    
                return res.status(201).json({
                    ok: true,
                    mensaje: 'Empleador adicionado exitosamente',  
                    //empleador: empleador
                });
            } else {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Error al adicionar Empleador',  
                    // solicitante: solicitante
                });
            }
                 
        } catch (err) {
            res.status(500).json({
                ok: false, 
                error: err.message 
             });
        }
    } 

    @httpPut("/:id",
        body('nombre','El nombre es oblidatorio').not().isEmpty(),
        body('apellidos','Los apellidos son obligatorios').not().isEmpty(),
        body('telefono','El telefono es obigatorio').not().isEmpty(),
        body('cedula','La cedula es obligatoria').not().isEmpty(),
        body('genero', 'El genero es obligatorio').not().isEmpty(),
        body('nacionalidad', 'La Nacionalidad es obligatoria').not().isEmpty(),
        body('direccion', 'La direccion es obligatoria').not().isEmpty(),
        body('id_ciudad', 'La ciudad es obligatoria').not().not().isEmpty(),
        body('email', 'El email es obligatorio').isEmail(),
        body('empresa', 'El valor boleano para la existencia de una empresa es obligatorio').not().isEmpty(),
        validarCampos
    )
    private async modificar(@requestParam("id") id: number,@request() req: express.Request, @response() res: express.Response) {
          
        try {
            const empleador = await this.empleadorService.buscar(id);
            if (!empleador){
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe un empleador con ese ID ${id}`
                });
            }
            const empleador_modificado = await this.empleadorService.modificar(empleador, req.body);
            if (empleador_modificado.affected === 1){
                return res.status(200).json({
                    ok:true,
                    mensaje: 'Empleador modificado exitosamente',
                });
            }else {
                
                return res.status(400).json({
                    ok:false,
                     mensaje: 'Error al modificar empleador',
                });
            }
        } catch (err) {
            res.status(500).json({  
                ok:false, 
                error: err.message });
        }
    } 

    @httpPut("/deshabilitar/:id",verificaToken)  
    private async eliminar(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const empleador = await this.empleadorService.eliminar(id);
            if (empleador.affected === 1){
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Empleador Eliminado exitosamente'
                })
            }else {
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Error al deshabilitar empleador',
                });
            }
           
        } catch (err) {
            res.status(500).json({ 
                ok: false,  
                error: err.message });  
        }
    }
  


    @httpPut("/activacion/:id", verificaToken)
    private async activarCuenta(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const empleador = await this.empleadorService.habilitar(id);
            if (empleador.affected === 1){
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Cuenta de empleador activada exitosamente'
                })
            }else {
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Error al activar cuenta de empleador',
                });
            }
        } catch (err) {
            res.status(400).json({ 
                ok: false,  
                error: err.message });  
        }
    }  

}