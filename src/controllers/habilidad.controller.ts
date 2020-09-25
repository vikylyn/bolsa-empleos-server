import * as express from "express";
import { interfaces, controller, httpGet, response, requestParam} from "inversify-express-utils";
import { inject } from "inversify";
import { TYPES } from "../../config/types";
import verificaToken from '../middlewares/verificar-token';
import { IIdiomaService } from '../interfaces/idioma.service';
import { INivelIdiomaService } from '../interfaces/nivel-idioma.service';
import { IHabilidadService } from '../interfaces/habilidad.service';
 
@controller("/habilidad")    
export class HabilidadController implements interfaces.Controller {  
 
    constructor( @inject(TYPES.IHabilidadService) private habilidadService: IHabilidadService ) {}
 
    @httpGet("/",verificaToken)
    private async listar(req: express.Request, res: express.Response, next: express.NextFunction) {
        let habilidades = await this.habilidadService.listar();
        return res.status(200).json({
            ok: true,
            habilidades: habilidades
        });
    }

    @httpGet("/:id",verificaToken)
    private async buscar(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const habilidad = await this.habilidadService.buscar(id); 
            if (!habilidad) {   
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe una habilidad con el ID ${id}`
                });
            }
            return res.status(201).json({
                ok: true,
                mensaje: 'Habilidad encontrada',
                habilidad: habilidad,
            });
        } catch (err) {
            res.status(400).json({ 
                ok: false,
                error: err.message 
            });
        }
    }
}