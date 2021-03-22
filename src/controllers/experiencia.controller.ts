import * as express from "express";
import { interfaces, controller, httpGet, httpPost, request, response, requestParam, httpPut, queryParam, httpDelete } from 'inversify-express-utils';
import { inject } from "inversify";
import { TYPES } from "../config/types";
import verificaToken from '../middlewares/verificar-token'
import validarCampos from '../middlewares/administrador/validar-campos';
import { body } from 'express-validator';
import { ICurriculumHabilidadService } from '../interfaces/ICurriculumHabilidad.service';
import { CurriculumHabilidad } from '../entity/curriculum-habilidad';
import { IExperienciaService } from '../interfaces/IExperiencia.service';
import { ExperienciaLaboral } from '../entity/experiencia-laboral';

@controller("/experiencia")      
export class ExperienciaController implements interfaces.Controller {    
 
    constructor( @inject(TYPES.IExperienciaService) private experienciaService: IExperienciaService
     ) {}
 
    @httpGet("/listar/:id",verificaToken)
    private async listar(@queryParam("desde") desde: number,@requestParam("id") id: number, req: express.Request, res: express.Response, next: express.NextFunction) {
        let experiencias = await this.experienciaService.listar(id, desde);
        let total = await this.experienciaService.contar(id);
        return res.status(200).json({
            ok: true,
            experiencias: experiencias,
            total
        }); 
    } 
    @httpGet("/:id",verificaToken)
    private async buscar(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const experiencia: ExperienciaLaboral = await this.experienciaService.buscar(id);
            if (!experiencia) {
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe una experiencia con el ID ${id}`
                });
            }
            return res.status(200).json({
                ok: true,
                experiencia: experiencia,
            });
        } catch (err) {
            res.status(500).json({
                ok: false, 
                error: err.message 
            });
        }
    } // 
    @httpPost("/",verificaToken,
        body('empresa','La empresa es Obligatoria').not().isEmpty(),
        body('puesto','El puesto es obligatorio').not().isEmpty(),
        body('descripcion','La descripcion es obligatoria').not().isEmpty(), 
        body('fecha_fin','La fecha de culminacion es obligatoria').not().isEmpty(),
        body('fecha_inicio','La fecha de inicio es obligatoria').not().isEmpty(),
        body('id_pais','El id del pais es obligatorio').not().isEmpty(),
      //  body('estado','El Estado o Departamento es obligatorio').not().isEmpty(),
      //  body('ciudad','La ciudad es obligatoria').not().isEmpty(),   
        body('id_curriculum','El id del curriculum es oblidatorio').not().isEmpty(),
        body('id_ciudad','El id de la ciudad es obligatorio').not().isEmpty(),
        body('id_tipo_contrato','El id del tipo de contrato laboral es obligatorio').not().isEmpty(),
   //     body('id_grupo_ocupacional','El id del grupo ocupacional laboral es obligatorio').not().isEmpty(),
        validarCampos
        )
    private async adicionar(@request() req: express.Request, @response() res: express.Response) {

        
        try { 
            const experiencia = await this.experienciaService.adicionar(req.body);
            if(experiencia) {
                return res.status(201).json({
                    ok: true,
                    mensaje: 'Experiencia adicionada exitosamente',  
                    experiencia
                });
            }else {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al adicionar experiencia', 
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
        body('empresa','La empresa es Obligatoria').not().isEmpty(),
        body('puesto','El puesto es obligatorio').not().isEmpty(),
        body('descripcion','La descripcion es obligatoria').not().isEmpty(), 
        body('fecha_fin','La fecha de culminacion es obligatoria').not().isEmpty(),
        body('fecha_inicio','La fecha de inicio es obligatoria').not().isEmpty(),
     //   body('estado','El Estado o Departamento es obligatorio').not().isEmpty(),
     //   body('ciudad','La ciudad es obligatoria').not().isEmpty(),   
        body('id_curriculum','El id del curriculum es oblidatorio').not().isEmpty(),
        body('id_ciudad','El id de la ciudad es obligatorio').not().isEmpty(),
        body('id_pais','El id del pais es obligatorio').not().isEmpty(),
        body('id_tipo_contrato','El id del tipo de contrato laboral es obligatorio').not().isEmpty(),
    //    body('id_grupo_ocupacional','El id del grupo ocupacional laboral es obligatorio').not().isEmpty(),
        validarCampos
    )
    private async modificar(@requestParam("id") id: number,@request() req: express.Request, @response() res: express.Response) {
          
        try {
            const experiencia = await this.experienciaService.buscar(id);
            if (!experiencia) {
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe una experiencia con el ID ${id}`
            });
            }
            const experiencia_modificada = await this.experienciaService.modificar(experiencia, req.body);
            if (experiencia_modificada === true) {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Experiencia modificada exitosamente'
                });
            } else {
                
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Error al modificar experiencia',
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
            const experiencia = await this.experienciaService.eliminar(id);
            if (experiencia === true){
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Experiencia Eliminada exitosamente'
                })
            }else {
                return res.status(400).json({
                    ok:false,
                     mensaje: 'Error al eliminar experiencia',
                });
            }

        } catch (err) {
            res.status(500).json({ 
                ok: false,  
                error: err.message 
            });  
        }
    }
 

}