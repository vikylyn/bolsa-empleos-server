import * as express from "express";
import { interfaces, controller, httpGet, httpPost, request, response, requestParam, httpPut, queryParam } from 'inversify-express-utils';
import { inject } from "inversify";
import { TYPES } from "../../config/types";
import verificaToken from '../middlewares/verificar-token';
import validarCampos from '../middlewares/administrador/validar-campos';
import { body } from 'express-validator';

import { IVacanteService } from '../interfaces/vacante.service';
import { Vacante } from '../entity/vacante';
 
@controller("/vacante")    
export class VacanteController implements interfaces.Controller {  
 
    constructor( @inject(TYPES.IVacanteService) private vacanteService: IVacanteService ) {}  
 
    @httpGet("/lista/:id",verificaToken)
    private async listar(@queryParam("desde") desde: number,@requestParam("id") id: number, req: express.Request, res: express.Response, next: express.NextFunction) {
        let vacantes = await this.vacanteService.listar(id, desde);
        let total = await this.vacanteService.contar(id);

        return res.status(200).json({
            ok: true,
            vacantes,
            total
        });
    }   
    @httpGet("/buscar/:id",verificaToken)
    private async buscar(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const vacante: Vacante = await this.vacanteService.buscar(id);
            if (!vacante) {
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe una vacante con el ID ${id}`
                });
            }
            return res.status(201).json({
                ok: true,
                vacante: vacante,
            });
        } catch (err) {
            res.status(400).json({
                ok: false, 
                error: err.message 
            });
        }
    } // 
    @httpPost("/adicionar/",verificaToken, 
        body('titulo','El titulo es oblidatorio').not().isEmpty(),
        body('sueldo','El sueldo es oblidatorio').not().isEmpty(),
        body('direccion','La direccion es obligatoria').not().isEmpty(),
        body('horario','El horario es oblidatorio').not().isEmpty(),
        body('num_vacantes','El numero de vacantes es oblidatorio').not().isEmpty(),
    //    body('funciones','las funciones son obligatorias').not().isEmpty(),
        body('descripcion','la descripcion es obligatoria').not().isEmpty(),
        body('habilitado','la habilitacion es obligatoria').not().isEmpty(),
        body('requisitos','los requisitos son obligatorios').not().isEmpty(),// aumentar el resto de campos del objeto
        body('tipo_contrato','El tipo de contrato es obligatorio').not().isEmpty(),
        body('ciudad','la ciudad es obligatoria').not().isEmpty(),
        body('empleador','El empleador es oblidatorio').not().isEmpty(),
        validarCampos
        )
    private async adicionar(@request() req: express.Request, @response() res: express.Response) {

        
        try { 
            const vacante = await this.vacanteService.adicionar(req.body);
            if(vacante) {
                return res.status(201).json({
                    ok: true,
                    mensaje: 'Vacante adicionada  exitosamente',  
                    vancante: vacante
                });
            }else {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al adicionar vacante', 
                });
            }
           
           
        } catch (err) {
            res.status(500).json({
                ok: false, 
                error: err.message 
             });
        }
    } 

    @httpPut("/modificar/:id",
        verificaToken, 
        body('titulo','El titulo es oblidatorio').not().isEmpty(),
        body('sueldo','El sueldo es oblidatorio').not().isEmpty(),
        body('direccion','La direccion es obligatoria').not().isEmpty(),
        body('horario','El horario es oblidatorio').not().isEmpty(),
        body('num_vacantes','El numero de vacantes es oblidatorio').not().isEmpty(),
    //    body('funciones','las funciones son obligatorias').not().isEmpty(),
        body('descripcion','la descripcion es obligatoria').not().isEmpty(),
        body('habilitado','la habilitacion es obligatoria').not().isEmpty(),
        body('requisitos','los requisitos son obligatorios').not().isEmpty(),// aumentar el resto de campos del objeto
        body('tipo_contrato','El tipo de contrato es obligatorio').not().isEmpty(),
        body('ciudad','la ciudad es obligatoria').not().isEmpty(),
        body('empleador','El empleador es oblidatorio').not().isEmpty(),
        validarCampos
    )
    private async modificar(@requestParam("id") id: number,@request() req: express.Request, @response() res: express.Response) {
          
        try {
            const vacante = await this.vacanteService.buscar(id);
            if (!vacante) {
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe una vacante con el ID ${id}`
            });
            }
            const vacante_modificada = await this.vacanteService.modificar(vacante.id, req.body);
            if (vacante_modificada.affected === 1) {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Vacante modificada exitosamente'
                });
            } else {
                
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Error al modificar Vacante',
                });
            }
        } catch (err) {
            res.status(400).json({  
                ok:false, 
                error: err.message });
        }
    } 

    @httpPut("/deshabilitar/:id",verificaToken)  
    private async deshabilitar(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const curriculum_habilidad = await this.vacanteService.deshabilitar(id);
            if (curriculum_habilidad.affected === 1){
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Vacante deshabilitada exitosamente'
                })
            }else {
                return res.status(400).json({
                    ok:false,
                     mensaje: 'Error al deshabilitar vacante',
                });
            }

        } catch (err) {
            res.status(400).json({ 
                ok: false,  
                error: err.message 
            });  
        }
    }

    @httpGet("/filtrar",verificaToken)
    private async filtrarVacantes(@queryParam("desde") desde: number,
            @queryParam("profesion") profesion_id: number,
            @queryParam("ciudad") ciudad_id: number,
            @queryParam("fecha") fecha: string, 
            @queryParam("tipo_contrato") tipo_contrato: number, 
            req: express.Request, 
            res: express.Response, 
            next: express.NextFunction) {
        let vacantes = await this.vacanteService.filtrarVacantes(profesion_id,ciudad_id,fecha,tipo_contrato,desde);
        return res.status(200).json({
            ok: true,
            vacantes: vacantes
        });
    }  
 
}