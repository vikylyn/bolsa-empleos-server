import * as express from "express";
import { interfaces, controller, httpGet, httpPost, request, response, requestParam, httpPut, queryParam } from 'inversify-express-utils';
import { inject } from "inversify";
import { TYPES } from "../../config/types";
import verificaToken from '../middlewares/verificar-token';

import validarCampos from '../middlewares/administrador/validar-campos';
import { body } from 'express-validator';
import { IOcupacionSolicitanteService } from '../interfaces/ocupacion-solicitante.service';
 
@controller("/ocupacion-solicitante")    
export class OcupacionSolicitanteController implements interfaces.Controller { 
    
 
    constructor( @inject(TYPES.IOcupacionSolicitanteService) private ocupacionService: IOcupacionSolicitanteService ) {}  
 
    @httpGet("/:id_solicitante",verificaToken)
    private async listar(@requestParam("id_solicitante") id_solicitante: number,@queryParam("desde") desde: number,req: express.Request, res: express.Response, next: express.NextFunction) {
        let ocupaciones = await this.ocupacionService.listar(id_solicitante, desde);
        let total = await this.ocupacionService.contar(id_solicitante);
        return res.status(200).json({
            ok: true,
            ocupaciones,
            total
        })
    }
    
    @httpPost("/",
        verificaToken,
        body('solicitante','El solicitante es oblidatorio').not().isEmpty(),
        body('ocupacion', 'La ocupacion es obligatoria').not().isEmpty(),
        body('habilitado', 'La habilitacion es obligatoria').not().isEmpty(),
        validarCampos
    )
    private async adicionar(@request() req: express.Request, @response() res: express.Response, next: express.NextFunction) {
        
        try {
            
            const ocupacion = await this.ocupacionService.adicionar(req.body);
            return res.status(201).json({
                ok: true,
                mensaje: 'Ocupacion asignada exitosamente',
                ocupacion
            });
        } catch (err) {
            res.status(500).json({
                ok: false,
                error: err.message 
            });
        }
    }
    @httpPut("/inhabilitar/:id",verificaToken) 
    private async eliminar(@requestParam("id") id: number, @response() res: express.Response, next: express.NextFunction) {
        try {
            const ocupacion = await this.ocupacionService.eliminar(id);
            if(ocupacion.affected === 1) {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Ocupacion Inhabilitada exitosamente',
                })
            }
           
        } catch (err) {
            res.status(500).json({
                ok: false,
                error: err.message });
        }
    }
    @httpPut("/habilitar/:id",verificaToken) 
    private async habilitar(@requestParam("id") id: number, @response() res: express.Response, next: express.NextFunction) {
        try {
            const ocupacion = await this.ocupacionService.habilitar(id);
            if(ocupacion.affected === 1) {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Ocupacion Inhabilitada exitosamente',
                })
            }
           
        } catch (err) {
            res.status(500).json({
                ok: false,
                error: err.message });
        }
    }

 

}