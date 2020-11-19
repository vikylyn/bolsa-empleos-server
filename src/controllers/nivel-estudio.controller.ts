import * as express from "express";
import { interfaces, controller, httpGet, response, requestParam} from "inversify-express-utils";
import { inject } from "inversify";
import { TYPES } from "../config/types";
import verificaToken from '../middlewares/verificar-token';
import { INivelEstudioService } from '../interfaces/nivel-estudio.service';
 
@controller("/nivel-estudio")    
export class NivelEstudioController implements interfaces.Controller {  
 
    constructor( @inject(TYPES.INivelEstudioService) private nivel_estudioService: INivelEstudioService ) {}
 
    @httpGet("/",verificaToken)
    private async listar(req: express.Request, res: express.Response, next: express.NextFunction) {
        let niveles = await this.nivel_estudioService.listar();
        return res.status(200).json({
            ok: true,
            niveles: niveles
        });
    }

    @httpGet("/:id",verificaToken)
    private async buscar(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const nivel = await this.nivel_estudioService.buscar(id); 
            if (!nivel) {   
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe un nivel con el ID ${id}`
                });
            }
            return res.status(201).json({
                ok: true,
                mensaje: 'Nivel encontrado',
                nivel: nivel,
            });
        } catch (err) {
            res.status(400).json({ 
                ok: false,
                error: err.message 
            });
        }
    }
}