import * as express from "express";
import { interfaces, controller, httpGet, httpPost, request, response, requestParam, httpPut, queryParam, httpDelete } from 'inversify-express-utils';
import { inject } from "inversify";
import { TYPES } from "../config/types";
import { IPaisService } from '../interfaces/IPais.service';
import { ICiudadService } from '../interfaces/ICiudad.service';
import { IEstadoService } from '../interfaces/IEstado.service';

@controller("/ubicacion")      
export class UbicacionController implements interfaces.Controller {    
 
    constructor( @inject(TYPES.IPaisService) private paisService: IPaisService,
                 @inject(TYPES.IEstadoService) private estadoService: IEstadoService,
                 @inject(TYPES.ICiudadService) private ciudadService: ICiudadService
     ) {}
 
    @httpGet("/pais")
    private async listarPaises(req: express.Request, res: express.Response, next: express.NextFunction) {
        let paises = await this.paisService.listar();
        return res.status(200).json({
            ok: true,
            paises
        });
    } 

    @httpGet("/ciudad/:id")
    private async listarCiudades(@requestParam("id") id: number,req: express.Request, res: express.Response, next: express.NextFunction) {
        let ciudades = await this.ciudadService.listar(id);
        return res.status(200).json({
            ok: true,
            ciudades
        });
    } 
    @httpGet("/estado")
    private async listarEstados( req: express.Request, res: express.Response, next: express.NextFunction) {
        let estados = await this.estadoService.listar();
        return res.status(200).json({
            ok: true,
            estados
        });
    } 
   

}