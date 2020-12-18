import * as express from "express";
import { interfaces, controller, httpGet, response, requestParam} from "inversify-express-utils";
import { inject } from "inversify";
import { TYPES } from "../config/types";
import verificaToken from '../middlewares/verificar-token';
import { IIdiomaService } from '../interfaces/IIdioma.service';
import { INivelIdiomaService } from '../interfaces/INivelIdioma.service';
import { IHabilidadService } from '../interfaces/IHabilidad.service';
 
@controller("/habilidad")    
export class HabilidadController implements interfaces.Controller {  
 
    constructor( @inject(TYPES.IHabilidadService) private habilidadService: IHabilidadService ) {}
 
    @httpGet("/:id_curriculum",verificaToken)
    private async listar(@requestParam("id_curriculum") id_curriculum: number, req: express.Request, res: express.Response, next: express.NextFunction) {
        let habilidades = await this.habilidadService.listar(id_curriculum);
        return res.status(200).json({
            ok: true,
            habilidades: habilidades
        });
    }

 /*   @httpGet("/:id",verificaToken)
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
*/
}