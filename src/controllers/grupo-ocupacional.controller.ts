import * as express from "express";
import { interfaces, controller, httpGet, httpPost, request, response, requestParam, httpPut, queryParam } from 'inversify-express-utils';
import { inject } from "inversify";
import { TYPES } from "../config/types";
import { IGrupoOcupacionalService } from '../interfaces/IGrupoOcupacional.service';
import verificaToken from '../middlewares/verificar-token';
import validarCampos from '../middlewares/administrador/validar-campos';
import { body } from 'express-validator';
import { GrupoOcupacional } from '../entity/grupo-ocupacional';
 
@controller("/grupo-ocupacional")    
export class GrupoOcupacionalController implements interfaces.Controller {  
 
    constructor( @inject(TYPES.IGrupoOcupacionalService) private grupoService: IGrupoOcupacionalService ) {}  
 
    @httpGet("/",verificaToken)
    private async listar(@queryParam("desde") desde: number,req: express.Request, res: express.Response, next: express.NextFunction) {
        let grupos: GrupoOcupacional[] = await this.grupoService.listar(desde);
        let total = await this.grupoService.contar();
        return res.status(200).json({
            ok: true, 
            grupos,
            total
        })
    }
    @httpGet("/todos")
    private async listarTodas(req: express.Request,res: express.Response, next: express.NextFunction) {
        let grupos: GrupoOcupacional[] = await this.grupoService.listarTodas();
        return res.status(200).json({
            ok: true, 
            grupos
        })
    }

    @httpGet("/:id",verificaToken)
    private async buscar(@requestParam("id") id: number, @response() res: express.Response, next: express.NextFunction) {
        try {
            const grupo: GrupoOcupacional = await this.grupoService.buscar(id);
            if (!grupo){
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe un grupo laboral con el ID ${id}`
                });
            }
            return res.status(200).json({
                ok: true,
                grupo,
            });
        } catch (err) {
            res.status(500).json({ 
                ok: false,
                error: err.message 
            });
        }
    }
    @httpGet("/busqueda/:nombre",verificaToken)
    private async buscarPorNombre(@requestParam("nombre") nombre: string, @response() res: express.Response, next: express.NextFunction) {
        try {
            const grupos: GrupoOcupacional[] = await this.grupoService.buscarPorNombre(nombre);
            if (!grupos){
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe un grupo ocupacional con el nombre ${nombre}`
            });
            } 
            return res.status(200).json({
                ok: true, 
                grupos,
            });
        } catch (err) {
            res.status(500).json({ 
                ok: false,
                error: err.message });
        }
    }
    @httpPut("/:id",
        verificaToken,
        body('nombre','El nombre es oblidatorio').not().isEmpty(),
        body('habilitado', 'La Habilitacion es obligatoria').not().isEmpty(),
        body('id_administrador', 'El id del administrador es obligatorio').not().isEmpty(),
        validarCampos
    )
    private async modificar(@requestParam("id") id: number,@request() req: express.Request, @response() res: express.Response, next: express.NextFunction) {
          
        try {
            const grupo: GrupoOcupacional = await this.grupoService.buscar(id);
            if (!grupo){
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe un grupo ocupacional con el ID ${id}`
                });
            }
            const grupo_modificado = await this.grupoService.modificar(grupo.id, req.body);
            
            if (grupo_modificado.affected === 1){
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Grupo modificado exitosamente',
                });
            }else {
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Error al modificar grupo ocupacional',
                });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } 
    @httpPost("/",
        verificaToken,
        body('nombre','El nombre es oblidatorio').not().isEmpty(),
        body('habilitado', 'La Habilitacion es obligatoria').not().isEmpty(),
        body('id_administrador', 'El id del administrador es obligatorio').not().isEmpty(),
        validarCampos
    )
    private async adicionar(@request() req: express.Request, @response() res: express.Response, next: express.NextFunction) {
        
        try {
            
            const grupo: GrupoOcupacional = await this.grupoService.adicionar(req.body);
            if (grupo) {
                return res.status(201).json({
                    ok: true,
                    mensaje: 'Area Laboral creada exitosamente',
                    grupo
                });
            }else {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al adicionar Area laboral'
                });
            }
           
        } catch (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error al adicionar Area laboral', 
                error: err.message });
        }
    }
    @httpGet("/inhabilitar/:id",verificaToken)
    private async inhabilitar(@requestParam("id") id: number, @response() res: express.Response, next: express.NextFunction) {
        try {
            const grupo: GrupoOcupacional = await this.grupoService.buscar(id);
            if (!grupo){
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe un grupo laboral con el ID ${id}`
                });
            }
            const grupoInhabilitado = await this.grupoService.inhabilitar(id)    
            if (grupoInhabilitado.affected === 1){
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Grupo inhabilitado exitosamente',
                });
            }else {
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Error al inhabilitar grupo ocupacional',
                });
            }
        } catch (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error al inhabilitar grupo ocupacional', 
                error: err.message });
        }
    }

    @httpGet("/habilitar/:id",verificaToken)
    private async habilitar(@requestParam("id") id: number, @response() res: express.Response, next: express.NextFunction) {
        try {
            const grupo: GrupoOcupacional = await this.grupoService.buscar(id);
            if (!grupo){
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe un grupo laboral con el ID ${id}`
                });
            }
            const grupoHabilitado = await this.grupoService.habilitar(id)
            
            if (grupoHabilitado.affected === 1){
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Grupo habilitado exitosamente',
                });
            }else {
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Error al habilitar grupo ocupacional',
                });
            }
        } catch (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error al habilitar grupo ocupacional', 
                error: err.message });
        }
    }

 

}