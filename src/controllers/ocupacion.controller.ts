import * as express from "express";
import { interfaces, controller, httpGet, httpPost, request, response, requestParam, httpPut, queryParam } from 'inversify-express-utils';
import { inject } from "inversify";
import { TYPES } from "../config/types";
import verificaToken from '../middlewares/verificar-token';
import { IOcupacionService } from '../interfaces/IOcupacion.service';

import validarCampos from '../middlewares/administrador/validar-campos';
import { body } from 'express-validator';
import { Ocupacion } from '../entity/ocupacion';
 
@controller("/ocupacion")    
export class OcupacionController implements interfaces.Controller { 
    
 
    constructor( @inject(TYPES.IOcupacionService) private ocupacionService: IOcupacionService ) {}  
 
    @httpGet("/",verificaToken)
    private async listar(@queryParam("desde") desde: number,req: express.Request, res: express.Response, next: express.NextFunction) {
        let ocupaciones = await this.ocupacionService.listar(desde);
        let total = await this.ocupacionService.contar();
        return res.status(200).json({
            ok: true,
            ocupaciones,
            total
        })
    }
    @httpGet("/todas")
    private async listarTodas(@queryParam("desde") desde: number,req: express.Request, res: express.Response, next: express.NextFunction) {
        let ocupaciones = await this.ocupacionService.listarTodas();
        return res.status(200).json({
            ok: true,
            ocupaciones
        })
    }
    @httpGet("/no-asiganadas/:id_solicitante",verificaToken)
    private async listarNoAsignadasSolicitante(@requestParam("id_solicitante") id_solicitante: number,req: express.Request, res: express.Response, next: express.NextFunction) {
        let ocupaciones = await this.ocupacionService.listarNoAsignadosSolicitante(id_solicitante);
        return res.status(200).json({
            ok: true,
            ocupaciones
        })
    }
    @httpGet("/:id_grupo",verificaToken)
    private async filtrar(@requestParam("id_grupo") id_grupo: number,
                          @queryParam("desde") desde: number,
                          @response() res: express.Response, 
                          next: express.NextFunction) {
        try {
            const ocupaciones = await this.ocupacionService.filtrar(id_grupo, desde);
            const total = await this.ocupacionService.contarFiltrados(id_grupo);
            if (!ocupaciones){
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existen ocupacioens con esos ids`
            });
            } 
            return res.status(200).json({
                ok: true,
                ocupaciones,
                total
            });
        } catch (err) {
            res.status(500).json({ 
                ok: false,
                error: err.message });
        }
    }
    @httpGet("/buscar/:id",verificaToken)
    private async buscar(@requestParam("id") id: number, @response() res: express.Response, next: express.NextFunction) {
        try {
            const ocupacion: Ocupacion = await this.ocupacionService.buscar(id);
            if (!ocupacion){
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe una ocupacion con el ID ${id}` 
                });
            }
            return res.status(200).json({
                ocupacion,
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    @httpGet("/busqueda/lista/:nombre",verificaToken)
    private async buscarPorNombre(@requestParam("nombre") nombre: string, @response() res: express.Response, next: express.NextFunction) {
        try {
            const ocupaciones: Ocupacion[] = await this.ocupacionService.buscarPorNombre(nombre);   
            if (!ocupaciones){
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe una profesion con el nombre ${nombre}`
            });
            } 
            return res.status(200).json({
                ok: true, 
                ocupaciones,
            });
        } catch (err) {
            res.status(500).json({ 
                ok: false,
                error: err.message });
        }
    }
    @httpPut("/:id",
        verificaToken,
        body('habilitado', 'La Habilitacion es obligatoria').not().isEmpty(),
        body('id_grupo_ocupacional', 'El id del grupo ocupacional es obligatoria').not().isEmpty(),
        body('id_administrador', 'El id del administrador es obligatorio').not().isEmpty(),
        validarCampos
    )
    private async modificar(@requestParam("id") id: number,@request() req: express.Request, @response() res: express.Response, next: express.NextFunction) {
          
        try {
            const ocupacion = await this.ocupacionService.buscar(id);
            if (!ocupacion){
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe una ocupacion con el ID ${id}`
                });
            }
            const ocupacion_m = await this.ocupacionService.modificar(ocupacion.id, req.body);
            if(ocupacion_m.affected === 1) {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Ocupacion modificada exitosamente',
                });
            }else {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Error al Modificar Ocupacion',
                });
            }
        } catch (err) {
            res.status(500).json({ 
                ok: false,
                error: err.message 
            });
        }
    } 
    @httpPost("/",
        verificaToken,
        body('nombre','El nombre es oblidatorio').not().isEmpty(),
        body('habilitado', 'La Habilitacion es obligatoria').not().isEmpty(),
        body('id_grupo_ocupacional', 'El id del grupo ocupacional es obligatoria').not().isEmpty(),
        body('id_administrador', 'El id del administrador es obligatorio').not().isEmpty(),
        validarCampos
    )
    private async adicionar(@request() req: express.Request, @response() res: express.Response, next: express.NextFunction) {
        
        try {
            
            const ocupacion = await this.ocupacionService.adicionar(req.body);
            if(!ocupacion) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Error al Adicionar Ocupacion',
                })
            }
            return res.status(201).json({
                ok: true,
                mensaje: 'Ocupacion creada exitosamente',
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
    private async inhabilitar(@requestParam("id") id: number, @response() res: express.Response, next: express.NextFunction) {
        try {
            const ocupacion = await this.ocupacionService.buscar(id);
            if (!ocupacion){
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe una ocupacion con el ID ${id}`
                });
            }
            const ocupacionInhabilitada = await this.ocupacionService.inhabilitar(id);
            if(ocupacionInhabilitada.affected === 1) {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Ocupacion Inhabilitada exitosamente',
                })
            }else {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Error al inhabilitar Ocupacion',
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
            const ocupacion = await this.ocupacionService.buscar(id);
            if (!ocupacion){
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe una ocupacion con el ID ${id}`
                });
            }
            const ocupacionHabilitada = await this.ocupacionService.habilitar(id);
            if(ocupacionHabilitada.affected === 1) {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Ocupacion Habilitada exitosamente',
                })
            }else {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Error al Habilitar Ocupacion',
                })
            }
           
        } catch (err) {
            res.status(500).json({
                ok: false,
                error: err.message });
        }
    }

 

}