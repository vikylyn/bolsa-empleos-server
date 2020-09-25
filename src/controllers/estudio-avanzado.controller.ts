import * as express from "express";
import { interfaces, controller, httpGet, httpPost, request, response, requestParam, httpPut, queryParam, httpDelete } from 'inversify-express-utils';
import { inject } from "inversify";
import { TYPES } from "../../config/types";
import verificaToken from '../middlewares/verificar-token'
import validarCampos from '../middlewares/administrador/validar-campos';
import { body } from 'express-validator';
import { IEstudioAvanzadoService } from '../interfaces/estudio-avanzado.service';
import { EstudioAvanzado } from '../entity/estudio-avanzado';

@controller("/curriculum/estudio-avanzado")      
export class EstudioAvanzadoController implements interfaces.Controller {    
 
    constructor( @inject(TYPES.IEstudioAvanzadoService) private estudio_avanzadoService: IEstudioAvanzadoService
     ) {}
 
    @httpGet("/lista/:id",verificaToken)
    private async listar(@queryParam("desde") desde: number,@requestParam("id") id: number, req: express.Request, res: express.Response, next: express.NextFunction) {
        let estudios_avanzados = await this.estudio_avanzadoService.listar(id, desde);
        let total = await this.estudio_avanzadoService.contar(id);
        return res.status(200).json({
            ok: true,
            estudios_avanzados,
            total
        });
    } 
    @httpGet("/:id",verificaToken)
    private async buscar(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const estudio: EstudioAvanzado = await this.estudio_avanzadoService.buscar(id);
            if (!estudio) {
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe un  estudio avanzado con el ID ${id}`
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
    } // 
    @httpPost("/",verificaToken, 
        body('institucion','La Institucion es obligatoria').not().isEmpty(), 
        body('carrera','La Carrera es obligatoria').not().isEmpty(), 
        body('fecha_fin','La fecha de culminacion es obligatoria').not().isEmpty(),
        body('fecha_inicio','La fecha de inicio es obligatoria').not().isEmpty(),
        body('estado','El Estado o Departamento es obligatorio').not().isEmpty(),
        body('ciudad','La ciudad es obligatoria').not().isEmpty(),   
        body('id_curriculum','El id del curriculum es oblidatorio').not().isEmpty(),
        body('id_pais','El id del pais es obligatorio').not().isEmpty(),
        body('id_nivel_estudio','El id del nivel de estudio es obligatorio').not().isEmpty(),
        validarCampos
        )
    private async adicionar(@request() req: express.Request, @response() res: express.Response) {

        
        try { 
            const estudio = await this.estudio_avanzadoService.adicionar(req.body);
            if(estudio) {
                return res.status(201).json({
                    ok: true,
                    mensaje: 'Estudio avanzado adicionado exitosamente',  
                    estudio: estudio
                });
            }else {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al adicionar Estudio avanzado', 
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
        body('institucion','La Institucion es obligatoria').not().isEmpty(), 
        body('carrera','La Carrera es obligatoria').not().isEmpty(), 
        body('fecha_fin','La fecha de culminacion es obligatoria').not().isEmpty(),
        body('fecha_inicio','La fecha de inicio es obligatoria').not().isEmpty(),
        body('estado','El Estado o Departamento es obligatorio').not().isEmpty(),
        body('ciudad','La ciudad es obligatoria').not().isEmpty(),   
        body('id_curriculum','El id del curriculum es oblidatorio').not().isEmpty(),
        body('id_pais','El id del pais es obligatorio').not().isEmpty(),
        body('id_nivel_estudio','El id del nivel de estudio es obligatorio').not().isEmpty(),
        validarCampos
    )
    private async modificar(@requestParam("id") id: number,@request() req: express.Request, @response() res: express.Response) {
          
        try {
            const estudio = await this.estudio_avanzadoService.buscar(id);
            if (!estudio) {
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe un estudio avanzado con el ID ${id}`
            });
            }
            const estudio_modificado = await this.estudio_avanzadoService.modificar(estudio.id, req.body);
            if (estudio_modificado.affected === 1) {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Estudio avanzado modificado exitosamente'
                });
            } else {
                
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Error al modificar estudio avanzado',
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
            const estudio = await this.estudio_avanzadoService.eliminar(id);
            if (estudio.affected === 1) {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Estudio avanzado eliminado exitosamente'
                })
            }else {
                return res.status(400).json({
                    ok:false,
                     mensaje: 'Error al eliminar Estudio avanzado',
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