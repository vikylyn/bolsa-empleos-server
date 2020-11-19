import * as express from "express";
import { interfaces, controller, httpGet, request, response, requestParam, httpPut, queryParam } from 'inversify-express-utils';
import { inject } from "inversify";
import { TYPES } from "../config/types";
import verificaToken from '../middlewares/verificar-token'
import validarCampos from '../middlewares/administrador/validar-campos';
import { body } from 'express-validator';
import { IEmpresaService } from '../interfaces/empresa.service';
import { Empresa } from '../entity/empresa';



@controller("/empresa")    
export class EmpresaController implements interfaces.Controller {    
 
    constructor( @inject(TYPES.IEmpresaService) private empresaService: IEmpresaService
     ) {}
 
    @httpGet("/",verificaToken)
    private async listar(@queryParam("desde") desde: number, req: express.Request, res: express.Response, next: express.NextFunction) {
        let empresas = await this.empresaService.listar(desde);
        return res.status(200).json({
            ok: true,
            empresas: empresas
        });
    } 
    @httpGet("/:id",verificaToken)
    private async buscar(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const empresa: Empresa = await this.empresaService.buscar(id);
            if (!empresa){
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe una empresa con el ID ${id}`
                });
            }
           
            return res.status(200).json({
                ok: true,
                empresa,
            });
        } catch (err) {
            res.status(500).json({
                ok: false, 
                error: err.message });
        }
    } 
    @httpGet("/empleador/:id",verificaToken)
    private async buscarPorIdEmpleador(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const empresa: Empresa = await this.empresaService.buscarPorIdEmpleador(id);
            if (!empresa){
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe una empresa con el ID de empleador ${id}`
                });
            }
           
            return res.status(200).json({
                ok: true,
                empresa,
            });
        } catch (err) {
            res.status(500).json({
                ok: false, 
                error: err.message });
        }
    } 
    @httpPut("/:id",
        body('nombre','El nombre es oblidatorio').not().isEmpty(),
        body('dominio_web','Los apellidos son obligatorios').not().isEmpty(),
        body('telefono','El telefono es obigatorio').not().isEmpty(),
        body('descripcion','La descripcion es obligatoria').not().isEmpty(),
        body('direccion', 'La direccion es obligatoria').not().isEmpty(),
        body('id_ciudad', 'La ciudad es obligatoria').not().not().isEmpty(),
        body('id_empleador', 'El id del empleador es obligatorio').not().isEmpty(),
        validarCampos
    )
    private async modificar(@requestParam("id") id: number,@request() req: express.Request, @response() res: express.Response) {
          
        try {
            const empresa = await this.empresaService.buscar(id);
            if (!empresa){
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe una empresa con ese ID ${id}`
                });
            }
            const empresa_modificada = await this.empresaService.modificar(empresa.id, req.body);
            if (empresa_modificada.affected === 1){
                return res.status(200).json({
                    ok:true,
                    mensaje: 'Empresa modificada exitosamente',
                });
            }else {
                
                return res.status(400).json({
                    ok:false,
                     mensaje: 'Error al modificar empresa',
                });
            }
        } catch (err) {
            res.status(500).json({  
                ok:false, 
                error: err.message });
        }
    } 

}