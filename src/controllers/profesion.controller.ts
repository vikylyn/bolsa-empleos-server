import * as express from "express";
import { interfaces, controller, httpGet, httpPost, request, response, requestParam, httpPut, queryParam } from 'inversify-express-utils';
import { inject } from "inversify";
import { TYPES } from "../../config/types";
import verificaToken from '../middlewares/verificar-token';
import { IProfesionService } from '../interfaces/profesion.service';

import validarCampos from '../middlewares/administrador/validar-campos';
import { body } from 'express-validator';
 
@controller("/profesion")    
export class ProfesionController implements interfaces.Controller { 
    
 
    constructor( @inject(TYPES.IProfesionService) private profesionService: IProfesionService ) {}  
 
    @httpGet("/",verificaToken)
    private async listar(@queryParam("desde") desde: number,req: express.Request, res: express.Response, next: express.NextFunction) {
        let profesiones = await this.profesionService.listar(desde);
        let total = await this.profesionService.contar();
        return res.status(200).json({
            ok: true,
            profesiones,
            total
        })
    }
    @httpGet("/todas")
    private async listarTodas(@queryParam("desde") desde: number,req: express.Request, res: express.Response, next: express.NextFunction) {
        let profesiones = await this.profesionService.listarTodas();
        return res.status(200).json({
            ok: true,
            profesiones: profesiones
        })
    }
    @httpGet("/:area/:actividad",verificaToken)
    private async filtrar(@requestParam("area") id_area: number,
                          @requestParam("actividad") id_actividad: number, 
                          @queryParam("desde") desde: number,
                          @response() res: express.Response, 
                          next: express.NextFunction) {
        try {
            const profesiones = await this.profesionService.filtrar(id_area, id_actividad, desde);
            const total = await this.profesionService.contarFiltrados(id_area, id_actividad);
            if (!profesiones){
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existen profesiones con esos ids`
            });
            } 
            return res.status(200).json({
                ok: true,
                profesiones,
                total
            });
        } catch (err) {
            res.status(500).json({ 
                ok: false,
                error: err.message });
        }
    }
    @httpGet("/:id",verificaToken)
    private async buscar(@requestParam("id") id: number, @response() res: express.Response, next: express.NextFunction) {
        try {
            const profesion = await this.profesionService.buscar(id);
            if (!profesion){
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe una profesion con el ID ${id}`
                });
            }
            return res.status(200).json({
                profesion: profesion,
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    @httpGet("/busqueda/lista/:nombre",verificaToken)
    private async buscarPorNombre(@requestParam("nombre") nombre: string, @response() res: express.Response, next: express.NextFunction) {
        try {
            const profesion = await this.profesionService.buscarPorNombre(nombre);   
            if (!profesion){
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe una profesion con el nombre ${nombre}`
            });
            } 
            return res.status(200).json({
                ok: true, 
                profesiones: profesion,
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
        body('id_area_laboral', 'El id del area laboral es obligatoria').not().isEmpty(),
        body('id_actividad_laboral', 'El id de la actividad laboral es obligatoria').not().isEmpty(),
        body('id_administrador', 'El id del administrador es obligatorio').not().isEmpty(),
        validarCampos
    )
    private async modificar(@requestParam("id") id: number,@request() req: express.Request, @response() res: express.Response, next: express.NextFunction) {
          
        try {
            const profesion = await this.profesionService.buscar(id);
            if (!profesion){
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe una profesion con el ID ${id}`
                });
            }
            const profesion_m = await this.profesionService.modificar(profesion.id, req.body);
            return res.status(200).json({
                ok: true,
                mensaje: 'Profesion modificada exitosamente',
            });
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
        body('id_area_laboral', 'El id del area laboral es obligatoria').not().isEmpty(),
        body('id_actividad_laboral', 'El id de la actividad laboral es obligatoria').not().isEmpty(),
        body('id_administrador', 'El id del administrador es obligatorio').not().isEmpty(),
        validarCampos
    )
    private async adicionar(@request() req: express.Request, @response() res: express.Response, next: express.NextFunction) {
        
        try {
            
            const profesion = await this.profesionService.adicionar(req.body);
            return res.status(201).json({
                ok: true,
                mensaje: 'Profesion creada exitosamente',
                profesion: profesion
            });
        } catch (err) {
            res.status(500).json({
                ok: false,
                error: err.message 
            });
        }
    }
    @httpPut("/deshabilitar/:id",verificaToken) 
    private async eliminar(@requestParam("id") id: number, @response() res: express.Response, next: express.NextFunction) {
        try {
            const profesion = await this.profesionService.eliminar(id);
            console.log(profesion)
            if(profesion.affected === 1) {
                console.log(profesion);
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Area laboral Eliminada exitosamente',
                })
            }
           
        } catch (err) {
            res.status(500).json({
                ok: false,
                error: err.message });
        }
    }

 

}