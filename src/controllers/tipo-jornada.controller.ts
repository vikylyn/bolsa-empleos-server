import * as express from "express";
import { interfaces, controller, httpGet, response, requestParam} from "inversify-express-utils";
import { inject } from "inversify";
import { TYPES } from "../config/types";
import verificaToken from '../middlewares/verificar-token';
import { ITipoJornadaService } from '../interfaces/ITipoJornada.service';
 
@controller("/tipo-jornada")    
export class TipoJornadaController implements interfaces.Controller {  
 
    constructor( @inject(TYPES.ITipoJornadaService) private tipoJornadaService: ITipoJornadaService) {}
 
    @httpGet("/",verificaToken)
    private async listar(req: express.Request, res: express.Response, next: express.NextFunction) {
        let jornadas = await this.tipoJornadaService.listar();
        return res.status(200).json({
            ok: true,
            tipo_jornadas: jornadas
        });
    }

}