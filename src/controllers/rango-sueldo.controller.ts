import * as express from "express";
import { interfaces, controller, httpGet, response, requestParam} from "inversify-express-utils";
import { inject } from "inversify";
import { TYPES } from "../config/types";
import verificaToken from '../middlewares/verificar-token';
import { IRangoSueldoService } from '../interfaces/rango-sueldo.service';
 
@controller("/sueldo")    
export class RangoSueldoController implements interfaces.Controller {  
 
    constructor( @inject(TYPES.IRangoSueldoService) private rango_sueldo: IRangoSueldoService) {}
 
    @httpGet("/",verificaToken)
    private async listar(req: express.Request, res: express.Response, next: express.NextFunction) {
        let sueldos = await this.rango_sueldo.listar();
        return res.status(200).json({
            ok: true,
            rango_sueldos: sueldos
        });
    }

    @httpGet("/:id",verificaToken)
    private async buscar(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const sueldo = await this.rango_sueldo.buscar(id); 
            if (!sueldo) {   
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe un rango de sueldo con el ID ${id}`
                });
            }
            return res.status(201).json({
                ok: true,
                mensaje: 'Rango de sueldo encontrado',
                rango_sueldo: sueldo,
            });
        } catch (err) {
            res.status(400).json({ 
                ok: false,
                error: err.message 
            });
        }
    }

}