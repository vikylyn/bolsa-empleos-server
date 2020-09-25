import * as express from "express";
import { interfaces, controller, httpGet, response, requestParam} from "inversify-express-utils";
import { inject } from "inversify";
import { IRolService } from '../interfaces/rol.service';
import { TYPES } from "../../config/types";
import verificaToken from '../middlewares/verificar-token';
import { IEstadoCivilService } from '../interfaces/estado-civil.service';
 
@controller("/estado-civil")    
export class EstadoCivilController implements interfaces.Controller {  
 
    constructor( @inject(TYPES.IEstadoCivilService) private estado_civilService: IEstadoCivilService ) {}
 
    @httpGet("/")
    private async listar(req: express.Request, res: express.Response, next: express.NextFunction) {
        let estados = await this.estado_civilService.listar();
        return res.status(200).json({
            ok: true,
            estados_civiles: estados
        })
    }
    @httpGet("/:id",verificaToken)
    private async buscar(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const estado = await this.estado_civilService.buscar(id); 
            if (!estado){   
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe un estado civil con el ID ${id}`
            });
            }
            return res.status(201).json({
                ok: true,
                mensaje: 'Estado civil encontrado',
                estado_civil: estado,
            });
        } catch (err) {
            res.status(400).json({ 
                ok: false,
                error: err.message 
            });
        }
    }

}