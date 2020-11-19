import * as express from "express";
import { interfaces, controller, httpGet, response, requestParam} from "inversify-express-utils";
import { inject } from "inversify";
import { TYPES } from "../config/types";
import verificaToken from '../middlewares/verificar-token';
import { ITipoContratoService } from '../interfaces/tipo-contrato.service';
 
@controller("/tipo-contrato")    
export class TipoContratoController implements interfaces.Controller {  
 
    constructor( @inject(TYPES.ITipoContratoService) private tipo_contratoService: ITipoContratoService) {}
 
    @httpGet("/",verificaToken)
    private async listar(req: express.Request, res: express.Response, next: express.NextFunction) {
        let contratos = await this.tipo_contratoService.listar();
        return res.status(200).json({
            ok: true,
            tipo_contratos: contratos
        });
    }

    @httpGet("/:id",verificaToken)
    private async buscar(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const contrato = await this.tipo_contratoService.buscar(id); 
            if (!contrato) {   
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe un tipo de contrato con el ID ${id}`
                });
            }
            return res.status(201).json({
                ok: true,
                mensaje: 'Tipo de contrato encontrado',
                tipo_contrato: contrato,
            });
        } catch (err) {
            res.status(400).json({ 
                ok: false,
                error: err.message 
            });
        }
    }

}