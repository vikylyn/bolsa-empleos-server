import * as express from "express";
import { interfaces, controller, httpGet, httpPost, request, response, requestParam, httpPut, queryParam, httpDelete } from 'inversify-express-utils';
import { inject } from "inversify";
import { TYPES } from "../../config/types";
import verificaToken from '../middlewares/verificar-token'
import validarCampos from '../middlewares/administrador/validar-campos';
import { body } from 'express-validator';
import { ICurriculumHabilidadService } from '../interfaces/curriculum-habilidad.service';
import { CurriculumHabilidad } from '../entity/curriculum-habilidad';

@controller("/curriculum/habilidad")      
export class CurriculumHabilidadController implements interfaces.Controller {    
 
    constructor( @inject(TYPES.ICurriculumHabilidadService) private curriculum_habilidadService: ICurriculumHabilidadService
     ) {}
 
    @httpGet("/lista/:id",verificaToken)
    private async listar(@queryParam("desde") desde: number,@requestParam("id") id: number, req: express.Request, res: express.Response, next: express.NextFunction) {
        let curriculums_habilidad = await this.curriculum_habilidadService.listar(id, desde);
        let total = await this.curriculum_habilidadService.contar(id);

        const result = curriculums_habilidad.map(curriculum => curriculum.habilidad);

        console.log(result);
        return res.status(200).json({
            ok: true,
            habilidades: curriculums_habilidad,
            total
        });
    } 
    @httpGet("/:id",verificaToken)
    private async buscar(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const curriculum_habilidad: CurriculumHabilidad = await this.curriculum_habilidadService.buscar(id);
            if (!curriculum_habilidad) {
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe una asignacion de habilidad con el ID ${id}`
                });
            }
            return res.status(201).json({
                ok: true,
                curriculum_habilidad: curriculum_habilidad,
            });
        } catch (err) {
            res.status(400).json({
                ok: false, 
                error: err.message 
            });
        }
    } // 
    @httpPost("/",verificaToken, 
        body('id_curriculum','El id del curriculum es oblidatorio').not().isEmpty(),
        body('id_habilidad','El id de la habilidad es obligatorio').not().isEmpty(),
        validarCampos
        )
    private async adicionar(@request() req: express.Request, @response() res: express.Response) {

        
        try { 
            const curriculum_habilidad = await this.curriculum_habilidadService.adicionar(req.body);
            if(curriculum_habilidad) {
                return res.status(201).json({
                    ok: true,
                    mensaje: 'Adicion de habilidad  exitosamente',  
                    habilidad: curriculum_habilidad
                });
            }else {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al adicionar habilidad', 
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
        body('id_curriculum','El id del curriculum es oblidatorio').not().isEmpty(),
        body('id_habilidad','El id de la habilidad es obligatorio').not().isEmpty(),
        validarCampos
    )
    private async modificar(@requestParam("id") id: number,@request() req: express.Request, @response() res: express.Response) {
          
        try {
            const curriculum_habilidad = await this.curriculum_habilidadService.buscar(id);
            if (!curriculum_habilidad) {
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe una asignacion de habilidad con el ID ${id}`
            });
            }
            const habilidad_modificada = await this.curriculum_habilidadService.modificar(curriculum_habilidad.id, req.body);
            if (habilidad_modificada.affected === 1) {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Asignancion de habilidad modificada exitosamente'
                });
            } else {
                
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Error al modificar la asiganacion de habilidad',
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
            const curriculum_habilidad = await this.curriculum_habilidadService.eliminar(id);
            if (curriculum_habilidad.affected === 1){
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Asignacion de habilidad Eliminada exitosamente'
                })
            }else {
                return res.status(400).json({
                    ok:false,
                     mensaje: 'Error al eliminar la asignacion de habilidad',
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