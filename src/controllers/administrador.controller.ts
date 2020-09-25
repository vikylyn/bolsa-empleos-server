import * as express from "express";
import { interfaces, controller, httpGet, httpPost, request, response, requestParam, httpPut, queryParam } from 'inversify-express-utils';
import { inject } from "inversify";
import { TYPES } from "../../config/types";
import { IAdministradorService } from '../interfaces/administrador.service';
import verificaToken from '../middlewares/verificar-token'
import validarCampos from '../middlewares/administrador/validar-campos';
import { body } from 'express-validator';
import { ICredencialesService } from '../interfaces/creadenciales.service';
import { Administrador } from '../entity/administrador';


@controller("/administrador")    
export class AdministradorController implements interfaces.Controller {    
 
    constructor( @inject(TYPES.IAdministradorService) private adminService: IAdministradorService,
                 @inject(TYPES.ICredencialesService) private credencialesService: ICredencialesService
     ) {}
 
    @httpGet("/",verificaToken)
    private async listar(@queryParam("desde") desde: number, req: express.Request, res: express.Response, next: express.NextFunction) {
        let administradores = await this.adminService.listar(desde);
        let total = await this.adminService.contar();
        return res.status(200).json({
            ok: true,
            total,
            administradores
            
        });
    } 
    @httpGet("/:id",verificaToken)
    private async buscar(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const administrador: Administrador = await this.adminService.buscar(id);
            if (!administrador){
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe un administrador con el ID ${id}`
                });
            }
           
            return res.status(201).json({
                ok: true,
                administrador: administrador,
            });
        } catch (err) {
            res.status(400).json({
                ok: false, 
                error: err.message });
        }
    } // 
    @httpPost("/", 
        verificaToken,
        body('nombre','El nombre es oblidatorio').not().isEmpty(),
        body('apellidos','Los apellidos son obligatorios').not().isEmpty(),
        body('telefono','El telefono es obigatorio').not().isEmpty(),
        body('cedula','La cedula es obligatoria').not().isEmpty(),
        body('genero', 'El genero es obligatorio').not().isEmpty(),
        body('habilitado', 'La Habilitacion es obligatoria').not().isEmpty(),
        body('email', 'El email es obligatorio').isEmail(),
        body('password', 'El password es Obligatorio').not().isEmpty(),
        body('id_rol', 'El id del Rol es obligatorio').not().isEmpty(),
        validarCampos
        )
    private async adicionar(@request() req: express.Request, @response() res: express.Response) {

        
        try { 
            const existe_email = await this.credencialesService.buscarCredenciales(req.body.email);
            if (existe_email) {
                return res.status(400).json({
                    ok: false, 
                    mensaje: 'Existe un usuario con ese email'
                 })
            }
            const admin = await this.adminService.adicionar(req.body);
            if(admin) {
                return res.status(201).json({
                    ok: true,
                    mensaje: 'Administrador creado exitosamente',  
                    administrador: admin
                });
            }else {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al adicionar Administrador',  
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
        verificaToken, 
        body('nombre','El nombre es oblidatorio').not().isEmpty(),
        body('apellidos','Los apellidos son obligatorios').not().isEmpty(),
        body('telefono','El telefono es obigatorio').not().isEmpty(),
        body('cedula','La cedula es obligatoria').not().isEmpty(),
        body('genero', 'El genero es obligatorio').not().isEmpty(),
        body('habilitado', 'La Habilitacion es obligatoria').not().isEmpty(),
        body('email', 'El email es obligatorio').isEmail(),
        validarCampos
    )
    private async modificar(@requestParam("id") id: number,@request() req: express.Request, @response() res: express.Response) {
          
        try {
            
            const administrador = await this.adminService.buscar(id);
            if (!administrador){
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe un administrador con ese ID ${id}`
            });
            }
            const email = await this.credencialesService.buscarEmailIguales(req.body.email,administrador.credenciales.id);
            if (email) {
                return res.status(400).json({
                    ok: false, 
                    mensaje: 'Existe un usuario con ese email'
                 })
            }
            const administrador_modificado = await this.adminService.modificar(administrador, req.body);
           
            if (administrador_modificado.affected === 1){
                return res.status(200).json({
                    ok:true,
                    mensaje: 'Administrador modificado exitosamente'
                });
            }else {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al modificar Administrador',
                });
            }
        } catch (err) {
            res.status(400).json({  
                ok:false, 
                error: err.message
            }); 
        }
    } 

    @httpGet("/deshabilitar/:id",verificaToken)  
    private async eliminar(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const administrador = await this.adminService.eliminar(id);
            if (administrador.affected === 1){
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Administrador Eliminado exitosamente'
                })
            }else {
                return res.status(400).json({
                    ok:false,
                     mensaje: 'Error al deshabilitar administrador',
                });
            }

        } catch (err) {
            res.status(400).json({ 
                ok: false,  
                error: err.message });  
        }
    }

    @httpGet("/busqueda/:nombre",verificaToken)
    private async buscarPorNombre(@requestParam("nombre") nombre: string, @response() res: express.Response, next: express.NextFunction) {
        try {
            const administrador = await this.adminService.buscarPorNombre(nombre);
            if (!administrador){
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe un administrador con el nombre ${nombre}`
            });
            }  
            return res.status(201).json({
                ok: true, 
                administradores: administrador,
            });
        } catch (err) {
            res.status(400).json({ 
                ok: false,
                error: err.message });
        }
    }
 

}