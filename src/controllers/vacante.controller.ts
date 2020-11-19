import * as express from "express";
import { interfaces, controller, httpGet, httpPost, request, response, requestParam, httpPut, queryParam, httpDelete } from 'inversify-express-utils';
import { inject } from "inversify";
import { TYPES } from "../config/types";
import verificaToken from '../middlewares/verificar-token';
import validarCampos from '../middlewares/administrador/validar-campos';
import { body } from 'express-validator';

import { IVacanteService } from '../interfaces/vacante.service';
import { Vacante } from '../entity/vacante';
 
@controller("/vacante")    
export class VacanteController implements interfaces.Controller {  
 
    constructor( @inject(TYPES.IVacanteService) private vacanteService: IVacanteService ) {}  
 
    @httpGet("/lista/:id",verificaToken)
    private async listarTodas(@queryParam("desde") desde: number,@requestParam("id") id: number, req: express.Request, res: express.Response, next: express.NextFunction) {
        let vacantes:Vacante[] = await this.vacanteService.listarTodas(id, desde);
        let total = await this.vacanteService.contarTodas(id);

        return res.status(200).json({
            ok: true,
            vacantes,
            total
        });
    } 
    @httpGet("/lista-habilitadas/:id",verificaToken)
    private async listarHabilitadas(@queryParam("desde") desde: number,@requestParam("id") id: number, req: express.Request, res: express.Response, next: express.NextFunction) {
        let vacantes:Vacante[] = await this.vacanteService.listarHabilitadas(id, desde);
        let total = await this.vacanteService.contarHabilitadas(id);

        return res.status(200).json({
            ok: true,
            vacantes,
            total
        });
    } 
    @httpGet("/lista-inhabilitadas/:id",verificaToken)
    private async listarInhabiltadas(@queryParam("desde") desde: number,@requestParam("id") id: number, req: express.Request, res: express.Response, next: express.NextFunction) {
        let vacantes:Vacante[] = await this.vacanteService.listarInhabilitadas(id, desde);
        let total = await this.vacanteService.contarInhabilitadas(id);

        return res.status(200).json({
            ok: true,
            vacantes,
            total
        });
    }   
    @httpPost("/filtrar",verificaToken)
    private async filtrarVacantes(
            @queryParam("desde") desde: number,
            req: express.Request, 
            res: express.Response, 
            next: express.NextFunction) {
        let vacantes = await this.vacanteService.filtrarVacantes(req.body, desde);
        return res.status(200).json({
            ok: true,
            vacantes: vacantes
        });
    }  
    @httpGet("/:id",verificaToken)
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
    @httpPost("/",verificaToken, 
        body('titulo','El titulo es oblidatorio').not().isEmpty(),
        body('id_sueldo','El id del sueldo es oblidatorio').not().isEmpty(),
        body('direccion','La direccion es obligatoria').not().isEmpty(),
        body('id_horario','El id del horario es oblidatorio').not().isEmpty(),
        body('num_vacantes','El numero de vacantes es oblidatorio').not().isEmpty(),
    //    body('funciones','las funciones son obligatorias').not().isEmpty(),
        body('descripcion','la descripcion es obligatoria').not().isEmpty(),
        body('habilitado','la habilitacion es obligatoria').not().isEmpty(),
   //     body('requisitos','los requisitos son obligatorios').not().isEmpty(),// aumentar el resto de campos del objeto
        body('id_tipo_contrato','El id del tipo de contrato es obligatorio').not().isEmpty(),
        body('id_ciudad','el id de la ciudad es obligatorio').not().isEmpty(),
        body('id_empleador','El id del empleador es oblidatorio').not().isEmpty(),

        body('experiencia','La experiencia es oblidatoria').not().isEmpty(),
        body('genero','El genero es oblidatorio').not().isEmpty(),
        body('id_ocupacion','El id de la ocupacion es oblidatorio').not().isEmpty(),
        body('id_idioma','El id del idioma es oblidatorio').not().isEmpty(),
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

    @httpPut("/:id",
        verificaToken, 
        body('titulo','El titulo es oblidatorio').not().isEmpty(),
        body('id_sueldo','El id del sueldo es oblidatorio').not().isEmpty(),
        body('direccion','La direccion es obligatoria').not().isEmpty(),
        body('id_horario','El id del horario es oblidatorio').not().isEmpty(),
        body('num_vacantes','El numero de vacantes es oblidatorio').not().isEmpty(),
    //    body('funciones','las funciones son obligatorias').not().isEmpty(),
        body('descripcion','la descripcion es obligatoria').not().isEmpty(),
        body('habilitado','la habilitacion es obligatoria').not().isEmpty(),
   //     body('requisitos','los requisitos son obligatorios').not().isEmpty(),// aumentar el resto de campos del objeto
        body('id_tipo_contrato','El id del tipo de contrato es obligatorio').not().isEmpty(),
        body('id_ciudad','el id de la ciudad es obligatorio').not().isEmpty(),
        body('id_empleador','El id del empleador es oblidatorio').not().isEmpty(),

        body('experiencia','La experiencia es oblidatoria').not().isEmpty(),
        body('genero','El genero es oblidatorio').not().isEmpty(),
        body('id_ocupacion','El id de la ocupacion es oblidatorio').not().isEmpty(),
        body('id_idioma','El id del idioma es oblidatorio').not().isEmpty(),
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
    @httpPut("/eliminacion-logica/:id",verificaToken)  
    private async  eliminar(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const vacante = await this.vacanteService.eliminarLogico(id);
            if (vacante.affected === 1){
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Vacante eliminada exitosamente'
                })
            }else {
                return res.status(400).json({
                    ok:false,
                     mensaje: 'Error al eliminar vacante',
                });
            }

        } catch (err) {
            res.status(400).json({ 
                ok: false,  
                error: err.message 
            });  
        }
    }
    @httpDelete("/eliminacion-fisica/:id",verificaToken)  
    private async  eliminarFisico(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const vacante = await this.vacanteService.eliminarFisico(id);
            if (vacante.affected === 1){
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Vacante eliminada exitosamente'
                })
            }else {
                return res.status(400).json({
                    ok:false,
                     mensaje: 'Error al eliminar vacante',
                });
            }

        } catch (err) {
            res.status(400).json({ 
                ok: false,  
                error: err.message 
            });  
        }
    }
    @httpPut("/inhabilitar/:id",verificaToken)  
    private async  inhabilitar(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const vacante = await this.vacanteService.inhabilitar(id);
            if (vacante.affected === 1){
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Vacante inhabilitada exitosamente'
                })
            }else {
                return res.status(400).json({
                    ok:false,
                     mensaje: 'Error al inhabilitar vacante',
                });
            }

        } catch (err) {
            res.status(400).json({ 
                ok: false,  
                error: err.message 
            });  
        }
    }

    @httpPut("/habilitar/:id",verificaToken)  
    private async habilitar(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const vacante = await this.vacanteService.habilitar(id);
            if (vacante.affected === 1){
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Vacante habilitada exitosamente'
                })
            }else {
                return res.status(400).json({
                    ok:false,
                     mensaje: 'Error al habilitar vacante',
                });
            }

        } catch (err) {
            res.status(400).json({ 
                ok: false,  
                error: err.message 
            });  
        }
    }

    @httpGet("/busqueda/:id/:valor",verificaToken)
    private async busqueda(@requestParam("valor") valor: string,@requestParam("id") idEmpleador: number, @response() res: express.Response, next: express.NextFunction) {
        try {
            const vacantes = await this.vacanteService.busqueda(valor,idEmpleador);
            if (!vacantes){
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existen vacantes con este parametro ${valor}`
            });
            }  
            return res.status(200).json({
                ok: true, 
                vacantes,
            });
        } catch (err) {
            res.status(400).json({ 
                ok: false,
                error: err.message });
        }
    }
 
}