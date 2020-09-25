import * as express from "express";
import { interfaces, controller, httpGet, httpPost, request, response, requestParam, httpPut, queryParam } from 'inversify-express-utils';
import { inject } from "inversify";
import { TYPES } from "../../config/types";
import { IAreaLaboralService } from '../interfaces/area-laboral.service';
import verificaToken from '../middlewares/verificar-token';
import validarCampos from '../middlewares/administrador/validar-campos';
import { body } from 'express-validator';
 
@controller("/area")    
export class AreaLaboralController implements interfaces.Controller {  
 
    constructor( @inject(TYPES.IAreaLaboralService) private areaService: IAreaLaboralService ) {}  
 
    @httpGet("/",verificaToken)
    private async listar(@queryParam("desde") desde: number,req: express.Request, res: express.Response, next: express.NextFunction) {
        let areas = await this.areaService.listar(desde);
        let total = await this.areaService.contar();
        return res.status(200).json({
            ok: true, 
            areas: areas,
            total
        })
    }
    @httpGet("/todas")
    private async listarTodas(req: express.Request,res: express.Response, next: express.NextFunction) {
        let areas = await this.areaService.listarTodas();
        return res.status(200).json({
            ok: true, 
            areas: areas
        })
    }

    @httpGet("/:id",verificaToken)
    private async buscar(@requestParam("id") id: number, @response() res: express.Response, next: express.NextFunction) {
        try {
            const area = await this.areaService.buscar(id);
            if (!area){
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe un area laboral con el ID ${id}`
            });
            }
            return res.status(200).json({
                ok: true,
                area: area,
            });
        } catch (err) {
            res.status(500).json({ 
                ok: false,
                error: err.message });
        }
    }
    @httpGet("/busqueda/:nombre",verificaToken)
    private async buscarPorNombre(@requestParam("nombre") nombre: string, @response() res: express.Response, next: express.NextFunction) {
        try {
            const area = await this.areaService.buscarPorNombre(nombre);
            if (!area){
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe un area laboral con el nombre ${nombre}`
            });
            } 
            return res.status(200).json({
                ok: true, 
                areas: area,
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
        body('administrador', 'El administrador es obligatorio').not().isEmpty(),
        validarCampos
    )
    private async modificar(@requestParam("id") id: number,@request() req: express.Request, @response() res: express.Response, next: express.NextFunction) {
          
        try {
            const area = await this.areaService.buscar(id);
            if (!area){
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe un area laboral con el ID ${id}`
                });
            }
            const area_modificada = await this.areaService.modificar(area.id, req.body);
            
            if (area_modificada.affected === 1){
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Area Laboral modificada exitosamente',
                });
            }else {
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Error al modificar administrador',
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
        body('administrador', 'El administrador es obligatorio').not().isEmpty(),
        validarCampos
    )
    private async adicionar(@request() req: express.Request, @response() res: express.Response, next: express.NextFunction) {
        
        try {
            
            const area = await this.areaService.adicionar(req.body);
            if (area) {
                return res.status(201).json({
                    ok: true,
                    mensaje: 'Area Laboral creada exitosamente',
                    area:area
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
    @httpGet("/deshabilitar/:id",verificaToken)
    private async eliminar(@requestParam("id") id: number, @response() res: express.Response, next: express.NextFunction) {
        try {
            const area = await this.areaService.eliminar(id)
            
            if (area.affected === 1){
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Area laboral Eliminada exitosamente',
                });
            }else {
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Error al deshabilitar area laboral',
                });
            }
        } catch (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error al deshabilitar el area laboral', 
                error: err.message });
        }
    }

 

}