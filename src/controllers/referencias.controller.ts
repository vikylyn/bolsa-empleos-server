import * as express from "express";
import { interfaces, controller, httpGet, httpPost, request, response, requestParam, httpPut, queryParam, httpDelete } from 'inversify-express-utils';
import { inject } from "inversify";
import { TYPES } from "../../config/types";
import verificaToken from '../middlewares/verificar-token'
import validarCampos from '../middlewares/administrador/validar-campos';
import { body } from 'express-validator';
import { IReferenciaService } from '../interfaces/referencias.service';
import { Referencia } from '../entity/referencia';

@controller("/curriculum/referencia")      
export class ReferenciaController implements interfaces.Controller {    
 
    constructor( @inject(TYPES.IReferenciaService) private referenciaService: IReferenciaService
     ) {}
 
    @httpGet("/lista/:id",verificaToken)
    private async listar(@queryParam("desde") desde: number,@requestParam("id") id: number, req: express.Request, res: express.Response, next: express.NextFunction) {
        let referencias = await this.referenciaService.listar(desde, id);
        let total = await this.referenciaService.contar(id);
        return res.status(200).json({
            ok: true,
            referencias,
            total
        });
    } 
    @httpGet("/:id",verificaToken)
    private async buscar(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            console.log(id)
            const referencia: Referencia = await this.referenciaService.buscar(id);
            if (!referencia) {
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe una referencia con el ID ${id}`
                });
            }
            return res.status(200).json({
                ok: true,
                referencia: referencia,
            });
        } catch (err) {
            res.status(500).json({
                ok: false, 
                error: err.message 
            });
        }
    } // 
    @httpPost("/",verificaToken, 
        body('nombre','El nombre es oblidatorio').not().isEmpty(),
        body('apellidos','Los apellidos son obligatorios').not().isEmpty(),
        body('empresa','La empresa es obligatoria').not().isEmpty(),
        body('cargo','El cargo es obligatoria').not().isEmpty(),
        body('telefono','El telefono es obigatorio').not().isEmpty(),
        body('id_curriculum', 'El id del curriculum es obligatorio').not().isEmpty(),
        validarCampos
        )
    private async adicionar(@request() req: express.Request, @response() res: express.Response) {

        
        try { 
            const referencia = await this.referenciaService.adicionar(req.body);
            if(referencia) {
                return res.status(201).json({
                    ok: true,
                    mensaje: 'referencia creada exitosamente',  
                    referencia: referencia
                });
            }else {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al adicionar referencia', 
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
        body('empresa','La empresa es obligatoria').not().isEmpty(),
        body('cargo','El cargo es obligatoria').not().isEmpty(),
        body('telefono','El telefono es obigatorio').not().isEmpty(),
        body('id_curriculum', 'El id del curriculum es obligatorio').not().isEmpty(),
        validarCampos
    )
    private async modificar(@requestParam("id") id: number,@request() req: express.Request, @response() res: express.Response) {
          
        try {
            const referencia = await this.referenciaService.buscar(id);
            if (!referencia){
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe una referencia con ese ID ${id}`
            });
            }
            const referencia_modificada = await this.referenciaService.modificar(referencia.id, req.body);
            if (referencia_modificada.affected === 1){
                return res.status(200).json({
                    ok:true,
                    mensaje: 'Referencia modificada exitosamente'
                });
            }else {
                
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Error al modificar Referencia',
                });
            }
        } catch (err) {
            res.status(500).json({  
                ok:false, 
                error: err.message });
        }
    } 

    @httpDelete("/:id",verificaToken)  
    private async eliminar(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const refencia = await this.referenciaService.eliminar(id);
            if (refencia.affected === 1){
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Administrador Eliminado exitosamente'
                })
            }else {
                return res.status(400).json({
                    ok:false,
                     mensaje: 'Error al eliminar referencia',
                });
            }

        } catch (err) {
            res.status(400).json({ 
                ok: false,  
                error: err.message });  
        }
    }
 

}