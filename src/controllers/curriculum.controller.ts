import * as express from "express";
import { interfaces, controller, httpGet, httpPost, request, response, requestParam, httpPut, queryParam } from 'inversify-express-utils';
import { inject } from "inversify";
import { TYPES } from "../../config/types";
import verificaToken from '../middlewares/verificar-token';
import validarCampos from '../middlewares/administrador/validar-campos';
import { body } from 'express-validator';
import { ICurriculumService } from '../interfaces/curriculum.service';
 
@controller("/curriculum")    
export class CurriculumController implements interfaces.Controller {  
 
    constructor( @inject(TYPES.ICurriculumService) private curriculumService: ICurriculumService ) {}  
 
    @httpGet("/",verificaToken)
    private async listar(@queryParam("desde") desde: number,req: express.Request, res: express.Response, next: express.NextFunction) {
        let curriculums = await this.curriculumService.listar(desde);
        return res.status(200).json({
            ok: true,
            curriculums: curriculums
        })
    }
    @httpGet("/:id",verificaToken)
    private async buscar(@requestParam("id") id: number, @response() res: express.Response, next: express.NextFunction) {
        try {
            const curriculum = await this.curriculumService.buscarPorId(id);
            if (!curriculum){
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe un curriculum con el ID ${id}`
            });
            }
            return res.status(201).json({
                ok: true,
                curriculum: curriculum,
            });
        } catch (err) {
            res.status(400).json({ 
                ok: false,
                error: err.message 
            });
        }
    }
    @httpGet("/solicitante/:id",verificaToken)
    private async buscarPorIdSolicitante(@requestParam("id") id_solicitante: number, @response() res: express.Response, next: express.NextFunction) {
        try {
            const curriculum = await this.curriculumService.buscarPorIdSolicitante(id_solicitante);
            if (!curriculum){
                return res.status(200).json({
                    ok: false,
                    mensaje:`No existe un curriculum para el solicitante con el ID ${id_solicitante}`
            });
            }
            return res.status(200).json({
                ok: true,
                curriculum: curriculum,
            });
        } catch (err) {
            res.status(500).json({ 
                ok: false,
                error: err.message 
            });
        }
    }
    @httpPut("/:id",
        verificaToken,
        body('titulo','El titulo es oblidatorio').not().isEmpty(),
        body('pretension_salarial', 'La pretension salarial es obligatoria').not().isEmpty(),
        body('biografia', 'La biografia es obligatoria').not().isEmpty(),
        validarCampos
    )
    private async modificar(@requestParam("id") id: number,@request() req: express.Request, @response() res: express.Response, next: express.NextFunction) {
          
        try {
            const curriculum = await this.curriculumService.buscarPorId(id);
            if (!curriculum){
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe un curriculum con el ID ${id}`
                });
            }
            const curriculum_modificado = await this.curriculumService.modificar(curriculum.id, req.body);
           
            if (curriculum_modificado.affected === 1){
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Curriculum modificado exitosamente',
                });
            }else {
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Error al modificar curriculum',
                });
            }
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    } 
    @httpPost("/",
        verificaToken,
        body('titulo','El titulo es oblidatorio').not().isEmpty(),
        body('pretension_salarial', 'La pretension salarial es obligatoria').not().isEmpty(),
        body('biografia', 'La biografia es obligatoria').not().isEmpty(),
        body('id_solicitante', 'El id del solicitante es obligatorio').not().isEmpty(),
        validarCampos
    )
    private async adicionar(@request() req: express.Request, @response() res: express.Response, next: express.NextFunction) {
        
        try {
              
            const curriculum = await this.curriculumService.adicionar(req.body);
           
            if (curriculum) {
                return res.status(201).json({
                    ok: true,
                    mensaje: 'Curriculum creado exitosamente',
                    curriculum: curriculum
                });
            } else {
                return res.status(500).json({
                    ok: true,
                    mensaje: 'Error al adicionar Curriculum'
                });
            }
        } catch (err) {
            res.status(400).json({
                ok: false,
                mensaje: 'Error al adicionar Curriculum', 
                error: err.message });
        }
    }
}