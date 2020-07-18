import * as express from "express";
import { interfaces, controller, httpGet, httpPost, request, response, requestParam, httpPut, queryParam } from 'inversify-express-utils';
import { inject } from "inversify";
import { TYPES } from "../../config/types";
import verificaToken from '../middlewares/verificar-token'
import validarCampos from '../middlewares/administrador/validar-campos';
import { body } from 'express-validator';
import { ICredencialesService } from '../interfaces/creadenciales.service';
import { ISolicitanteService } from '../interfaces/solicitante.service';
import { Solicitante } from '../entity/solicitante';

@controller("/solicitante")    
export class SolicitanteController implements interfaces.Controller {    
 
    constructor( @inject(TYPES.ISolicitanteService) private solicitanteService: ISolicitanteService,
                 @inject(TYPES.ICredencialesService) private credencialesService: ICredencialesService
     ) {}
 
    @httpGet("/",verificaToken)
    private async listar(@queryParam("desde") desde: number, req: express.Request, res: express.Response, next: express.NextFunction) {
        let solicitates = await this.solicitanteService.listar(desde);
        return res.status(200).json({
            ok: true,
            solicitantes: solicitates
        });
    } 
    @httpGet("/:id",verificaToken)
    private async buscar(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const solicitante: Solicitante = await this.solicitanteService.buscar(id);
            if (!solicitante){
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe un solicitante con el ID ${id}`
                });
            }
           
            return res.status(201).json({
                ok: true,
                solicitante: solicitante,
            });
        } catch (err) {
            res.status(400).json({
                ok: false, 
                error: err.message });
        }
    } // 
    @httpPost("/",verificaToken, 
        body('nombre','El nombre es oblidatorio').not().isEmpty(),
        body('apellidos','Los apellidos son obligatorios').not().isEmpty(),
        body('telefono','El telefono es obigatorio').not().isEmpty(),
        body('cedula','La cedula es obligatoria').not().isEmpty(),
        body('genero', 'El genero es obligatorio').not().isEmpty(),
        body('nacionalidad', 'La Nacionalidad es obligatoria').not().isEmpty(),
        body('direccion', 'La direccion es obligatoria').not().isEmpty(),
        body('estado_civil', 'El estado civil es obligatorio').not().isEmpty(),
        body('ciudad', 'La ciudad es obligatoria').not().not().isEmpty(),
        body('profesion', 'La profesion es obligatoria').not().isEmpty(),
        body('credenciales.email', 'El email es obligatorio').isEmail(),
        body('credenciales.password', 'El password es Obligatorio').not().isEmpty(),
        body('credenciales.rol.id', 'El id del Rol es obligatorio').not().isEmpty(),
        body('credenciales.rol.nombre', 'El nombre de rol es obligatorio').not().isEmpty(),
        validarCampos
        )
    private async adicionar(@request() req: express.Request, @response() res: express.Response) {

        
        try {
            const existe_email = await this.credencialesService.buscarCredenciales(req.body.credenciales.email);
            if (existe_email) {
                return res.status(400).json({
                    ok: false, 
                    mensaje: 'Existe un usuario con ese email'
                 })
            }
            const solicitante = await this.solicitanteService.adicionar(req.body);
           
            return res.status(201).json({
                ok: true,
                mensaje: 'Solicitante creado exitosamente',  
                solicitante: solicitante
            });
            
        } catch (err) {
            res.status(400).json({
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
        body('nacionalidad', 'La Nacionalidad es obligatoria').not().isEmpty(),
        body('direccion', 'La direccion es obligatoria').not().isEmpty(),
        body('estado_civil', 'El estado civil es obligatorio').not().isEmpty(),
        body('ciudad', 'La ciudad es obligatoria').not().isEmpty(),
        body('profesion', 'La profesion es obligatoria').not().isEmpty(),
        body('credenciales.email', 'El email es obligatorio').isEmail(),
        validarCampos
    )
    private async modificar(@requestParam("id") id: number,@request() req: express.Request, @response() res: express.Response) {
          
        try {
            const solicitante = await this.solicitanteService.buscar(id);
            if (!solicitante){
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe un solicitante con ese ID ${id}`
            });
            }
            const solicitante_modificado = await this.solicitanteService.modificar(solicitante.id, req.body);
            if (solicitante_modificado.affected === 1){
                return res.status(200).json({
                    ok:true,
                    mensaje: 'Administrador modificado exitosamente',
                });
            }else {
                
                return res.status(400).json({
                    ok:false,
                     mensaje: 'Error al modificar solicitante',
                });
            }
        } catch (err) {
            res.status(400).json({  
                ok:false, 
                error: err.message });
        }
    } 

    @httpPut("/deshabilitar/:id",verificaToken)  
    private async eliminar(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const solicitante = await this.solicitanteService.eliminar(id);
            if (solicitante.affected === 1){
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Solicitante Eliminado exitosamente'
                })
            }else {
                return res.status(400).json({
                    ok:false,
                     mensaje: 'Error al deshabilitar solicitante',
                });
            }
           
        } catch (err) {
            res.status(400).json({ 
                ok: false,  
                error: err.message });  
        }
    }
    @httpPut("/activar-ocupacion/:id",verificaToken)  
    private async activarOcupacion(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const solicitante = await this.solicitanteService.activar_ocupacion(id);
            if (solicitante.affected === 1){
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Se activo la ocupacion del solicitante exitosamente'
                })
            }else {
                return res.status(400).json({
                    ok:false,
                     mensaje: 'Error al activar ocupacion del solicitante',
                });
            }
        } catch (err) {
            res.status(400).json({ 
                ok: false,  
                error: err.message });  
        }
    }

    @httpPut("/desactivar-ocupacion/:id",verificaToken)  
    private async desactivarOcupacion(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const solicitante = await this.solicitanteService.desactivar_ocupacion(id);
            if (solicitante.affected === 1){
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Se desactivo la ocupacion del solicitante exitosamente'
                })
            }else {
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Error al desactivar ocupacion del solicitante',
                });
            }
        } catch (err) {
            res.status(400).json({ 
                ok: false,  
                error: err.message });  
        }
    }

}