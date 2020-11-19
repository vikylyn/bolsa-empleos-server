import * as express from "express";
import { interfaces, controller, httpGet, response, requestParam} from "inversify-express-utils";
import { inject } from "inversify";
import { TYPES } from "../config/types";
import verificaToken from '../middlewares/verificar-token';
import { IGradoEscolarService } from '../interfaces/grado-escolar.service';
 
@controller("/grado-escolar")    
export class GradoEscolarController implements interfaces.Controller {  
 
    constructor( @inject(TYPES.IGradoEscolarService) private grado_escolarService: IGradoEscolarService ) {}
 
    @httpGet("/",verificaToken)
    private async listar(req: express.Request, res: express.Response, next: express.NextFunction) {
        let grados = await this.grado_escolarService.listar();
        return res.status(200).json({
            ok: true,
            grados: grados
        });
    }

    @httpGet("/:id",verificaToken)
    private async buscar(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const grado = await this.grado_escolarService.buscar(id); 
            if (!grado) {   
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe un grado con el ID ${id}`
                });
            }
            return res.status(201).json({
                ok: true,
                mensaje: 'Grado encontrado',
                grado: grado,
            });
        } catch (err) {
            res.status(400).json({ 
                ok: false,
                error: err.message 
            });
        }
    }
}