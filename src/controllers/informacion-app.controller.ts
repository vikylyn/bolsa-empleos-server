import * as express from "express";
import { interfaces, controller, httpGet, httpPost, request, response, requestParam, httpPut, queryParam, httpDelete } from 'inversify-express-utils';
import { inject } from "inversify";
import { TYPES } from "../config/types";
import verificaToken from '../middlewares/verificar-token'
import validarCampos from '../middlewares/administrador/validar-campos';
import { body } from 'express-validator';
import { InformacionApp } from '../entity/informacionApp';
import { IInformacionAppService } from '../interfaces/IInformacionApp.service';

@controller("/informacion")      
export class InformacionAppController implements interfaces.Controller {    
 
    constructor( @inject(TYPES.IInformacionAppService) private infoService: IInformacionAppService
     ) {}
 
    @httpGet("/:id",verificaToken)
    private async buscar(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const informacion: InformacionApp = await this.infoService.buscar(id);
            if (!informacion) {
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe informacion para el ID ${id}`
                });
            }
            return res.status(200).json({
                ok: true,
                informacion,
            });
        } catch (err) {
            res.status(500).json({
                ok: false, 
                error: err.message 
            });
        }
    } // 
  
    @httpPut("/:id",
        verificaToken, 
        body('nombre','El nombre de la Aplicacion es obligatorio').not().isEmpty(),
        body('eslogan','El eslogan es obligatorio').not().isEmpty(),
        body('descripcion','La descripcion es obligatoria').not().isEmpty(), 
        body('telefono','El telefono es obligatorio').not().isEmpty(),
        body('email', 'El email es obligatorio').isEmail(),
        body('direccion','La direccion es obligatoria').not().isEmpty(),
        body('id_ciudad','El id de la ciudad es obligatorio').not().isEmpty(),
        validarCampos
    )
    private async modificar(@requestParam("id") id: number,@request() req: express.Request, @response() res: express.Response) {
          
        try {
            const informacion: InformacionApp = await this.infoService.buscar(id);
            if (!informacion) {
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe una experiencia con el ID ${id}`
            });
            }
            const informacion_modificada = await this.infoService.modificar(informacion.id, req.body);
            if (informacion_modificada) {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Informacion modificada exitosamente'
                });
            } else {
                
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Error al modificar Informacion',
                });
            }
        } catch (err) {
            res.status(500).json({  
                ok:false, 
                error: err.message });
        }
    } 

  

}