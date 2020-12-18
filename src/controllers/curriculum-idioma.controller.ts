import * as express from "express";
import { interfaces, controller, httpGet, httpPost, request, response, requestParam, httpPut, queryParam, httpDelete } from 'inversify-express-utils';
import { inject } from "inversify";
import { TYPES } from "../config/types";
import verificaToken from '../middlewares/verificar-token'
import validarCampos from '../middlewares/administrador/validar-campos';
import { body } from 'express-validator';
import { ICurriculumIdiomaService } from '../interfaces/ICurriculum-idioma.service';
import { CurriculumIdioma } from '../entity/curriculum-idioma';

@controller("/curriculum/idioma")      
export class CurriculumIdiomaController implements interfaces.Controller {    
 
    constructor( @inject(TYPES.ICurriculumIdiomaService) private curriculum_idiomaService: ICurriculumIdiomaService
     ) {}
 
    @httpGet("/lista/:id",verificaToken)
    private async listar(@queryParam("desde") desde: number,@requestParam("id") id: number, req: express.Request, res: express.Response, next: express.NextFunction) {
        let curriculums_idiomas = await this.curriculum_idiomaService.listar(id, desde);
        let total = await this.curriculum_idiomaService.contar(id);
        return res.status(200).json({
            ok: true,
            curriculums_idiomas,
            total
        });
    } 
    @httpGet("/:id",verificaToken)
    private async buscar(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const curriculum_idioma: CurriculumIdioma = await this.curriculum_idiomaService.buscar(id);
            if (!curriculum_idioma) {
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe una asignacion de idioma con el ID ${id}`
                });
            }
            return res.status(200).json({
                ok: true,
                curriculum_idioma: curriculum_idioma,
            });
        } catch (err) {
            res.status(500).json({
                ok: false, 
                error: err.message 
            });
        }
    } 
    @httpPost("/",verificaToken, 
        body('id_curriculum','El id del Curriculum es oblidatorio').not().isEmpty(),
        body('id_idioma','El id del idioma es obligatorio').not().isEmpty(),
        body('id_nivel_escrito','El id de Nivel del idioma escrito es obligatorio').not().isEmpty(),
        body('id_nivel_oral','El id de Nivel del idioma escrito es obligatorio').not().isEmpty(),
        body('id_nivel_lectura', 'El id del Nivel de lectura del idioma es obligatorio').not().isEmpty(),
        validarCampos
        )
    private async adicionar(@request() req: express.Request, @response() res: express.Response) {

        
        try { 
            const curriculum_idioma = await this.curriculum_idiomaService.adicionar(req.body);
            if(curriculum_idioma) {
                return res.status(201).json({
                    ok: true,
                    mensaje: 'Adicion de idioma  exitosamente',  
                    referencia: curriculum_idioma
                });
            }else {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al adicionar idioma', 
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
        body('id_curriculum','El id del Curriculum es oblidatorio').not().isEmpty(),
        body('id_idioma','El id del idioma es obligatorio').not().isEmpty(),
        body('id_nivel_escrito','El id de Nivel del idioma escrito es obligatorio').not().isEmpty(),
        body('id_nivel_oral','El id de Nivel del idioma escrito es obligatorio').not().isEmpty(),
        body('id_nivel_lectura', 'El id del Nivel de lectura del idioma es obligatorio').not().isEmpty(),
        validarCampos
    )
    private async modificar(@requestParam("id") id: number,@request() req: express.Request, @response() res: express.Response) {
          
        try {
            const curriculum_idioma = await this.curriculum_idiomaService.buscar(id);
            if (!curriculum_idioma){
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe una asignacion de idioma con ese ID ${id}`
            });
            }
            const referencia_modificada = await this.curriculum_idiomaService.modificar(curriculum_idioma.id, req.body);
            if (referencia_modificada.affected === 1){
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Asignancion de idioma modificada exitosamente'
                });
            }else {
                
                return res.status(500).json({
                    ok:false,
                    mensaje: 'Error al modificar la asiganacion de idioma',
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
            const curriculum_idioma = await this.curriculum_idiomaService.eliminar(id);
            if (curriculum_idioma.affected === 1){
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Asignacion de idioma Eliminada exitosamente'
                })
            }else {
                return res.status(400).json({
                    ok:false,
                     mensaje: 'Error al eliminar asignacion de idioma',
                });
            }

        } catch (err) {
            res.status(500).json({ 
                ok: false,  
                error: err.message });  
        }
    }
 

}