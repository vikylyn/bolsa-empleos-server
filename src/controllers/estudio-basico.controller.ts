import * as express from "express";
import { interfaces, controller, httpGet, httpPost, request, response, requestParam, httpPut, queryParam, httpDelete } from 'inversify-express-utils';
import { inject } from "inversify";
import { TYPES } from "../config/types";
import verificaToken from '../middlewares/verificar-token'
import validarCampos from '../middlewares/administrador/validar-campos';
import { body } from 'express-validator';
import { IEstudioBasicoService } from '../interfaces/estudio-basico.service';
import { EstudioBasico } from '../entity/estudio-basico';

@controller("/curriculum/estudio-basico")      
export class EstudioBasicoController implements interfaces.Controller {    
 
    constructor( @inject(TYPES.IEstudioBasicoService) private estudio_basicoService: IEstudioBasicoService
     ) {}
 
    @httpGet("/lista/:id",verificaToken)
    private async listar(@queryParam("desde") desde: number,@requestParam("id") id: number, req: express.Request, res: express.Response, next: express.NextFunction) {
        let estudios_basicos = await this.estudio_basicoService.listar(id, desde);
        let total = await this.estudio_basicoService.contar(id);
        return res.status(200).json({
            ok: true,
            estudios_basicos,
            total
        });
    } 
    @httpGet("/:id",verificaToken)
    private async buscar(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const estudio: EstudioBasico = await this.estudio_basicoService.buscar(id);
            if (!estudio) {
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe un  estudio basico con el ID ${id}`
                });
            }
            return res.status(200).json({
                ok: true,
                estudio: estudio,
            });
        } catch (err) {
            res.status(500).json({
                ok: false, 
                error: err.message 
            });
        }
    } 
    @httpPost("/",verificaToken, 
        body('colegio','El colegio es obligatorio').not().isEmpty(), 
        body('fecha_fin','La fecha de culminacion es obligatoria').not().isEmpty(),
        body('fecha_inicio','La fecha de inicio es obligatoria').not().isEmpty(),
        body('estado','El Estado o Departamento es obligatorio').not().isEmpty(),
        body('ciudad','La ciudad es obligatoria').not().isEmpty(),  
        body('id_grado_inicio','El id del grado de inicio es oblidatorio').not().isEmpty(),
        body('id_grado_fin','El id del grado de finalizacion es oblidatorio').not().isEmpty(),
        body('id_curriculum','El id del curriculum es oblidatorio').not().isEmpty(),
        body('id_pais','El id del pais es obligatorio').not().isEmpty(),
        validarCampos
        )
    private async adicionar(@request() req: express.Request, @response() res: express.Response) {

        
        try { 
            const estudio = await this.estudio_basicoService.adicionar(req.body);
            if(estudio) {
                return res.status(201).json({
                    ok: true,
                    mensaje: 'Estudio basico adicionado exitosamente',  
                    estudio: estudio
                });
            }else {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al adicionar Estudio basico', 
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
        body('colegio','El colegio es obligatorio').not().isEmpty(), 
        body('fecha_fin','La fecha de culminacion es obligatoria').not().isEmpty(),
        body('fecha_inicio','La fecha de inicio es obligatoria').not().isEmpty(),
        body('estado','El Estado o Departamento es obligatorio').not().isEmpty(),
        body('ciudad','La ciudad es obligatoria').not().isEmpty(),   
        body('id_grado_inicio','El id del grado de inicio es oblidatorio').not().isEmpty(),
        body('id_grado_fin','El id del grado de finalizacion es oblidatorio').not().isEmpty(),
        body('id_curriculum','El id del curriculum es oblidatorio').not().isEmpty(),
        body('id_pais','El id del pais es obligatorio').not().isEmpty(),
        validarCampos
    )
    private async modificar(@requestParam("id") id: number,@request() req: express.Request, @response() res: express.Response) {
          
        try {
            const estudio = await this.estudio_basicoService.buscar(id);
            if (!estudio) {
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe un estudio basico con el ID ${id}`
            });
            }
            const estudio_modificado = await this.estudio_basicoService.modificar(estudio.id, req.body);
            if (estudio_modificado.affected === 1) {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Estudio basico modificado exitosamente'
                });
            } else {
                
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Error al modificar estudio basico',
                });
            }
        } catch (err) {
            res.status(400).json({  
                ok:false, 
                error: err.message });
        }
    } 

    @httpDelete("/:id",verificaToken)  
    private async eliminar(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const estudio = await this.estudio_basicoService.eliminar(id);
            if (estudio.affected === 1) {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Estudio basico eliminado exitosamente'
                })
            }else {
                return res.status(400).json({
                    ok:false,
                     mensaje: 'Error al eliminar Estudio basico',
                });
            }

        } catch (err) {
            res.status(400).json({ 
                ok: false,  
                error: err.message 
            });  
        }
    }
 

}