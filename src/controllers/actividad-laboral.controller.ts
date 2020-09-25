import * as express from "express";
import { interfaces, controller, httpGet, httpPost, request, response, requestParam, httpPut, queryParam } from 'inversify-express-utils';
import { inject } from "inversify";
import { TYPES } from "../../config/types";
import verificaToken from '../middlewares/verificar-token';
import { IActividadLaboralService } from '../interfaces/actividad-laboral.service';
 
@controller("/actividad-laboral")    
export class ActividadLaboralController implements interfaces.Controller {  
 
    constructor( @inject(TYPES.IActividadLaboralService) private actividadService: IActividadLaboralService ) {}  
 
    @httpGet("/",verificaToken)
    private async listar(req: express.Request, res: express.Response, next: express.NextFunction) {
        let actividades = await this.actividadService.listar();  
        return res.status(200).json({
            ok: true,
            actividades
        });
    }

}