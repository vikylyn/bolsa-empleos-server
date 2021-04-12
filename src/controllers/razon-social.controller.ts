import * as express from "express";
import { interfaces, controller, httpGet} from "inversify-express-utils";
import { inject } from "inversify";
import { TYPES } from "../config/types";
import { IRazonSocialService } from '../interfaces/IRazonSocial.service';
import { RazonSocial } from '../entity/razon-social';
 
@controller("/razon-social")    
export class RazonSocialController implements interfaces.Controller {  
 
    constructor(@inject(TYPES.IRazonSocialService) private razonSocialService: IRazonSocialService) {}
 
    @httpGet("/")
    private async listarRazonesSociales(req: express.Request, res: express.Response, next: express.NextFunction) {
        let razones_sociales: RazonSocial[] = await this.razonSocialService.listar();
        return res.status(200).json({
            ok: true,
            razones_sociales
        });  
    } 

}