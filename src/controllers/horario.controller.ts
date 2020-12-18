import * as express from "express";
import { interfaces, controller, httpGet, response, requestParam} from "inversify-express-utils";
import { inject } from "inversify";
import { TYPES } from "../config/types";
import verificaToken from '../middlewares/verificar-token';
import { IHorarioService } from '../interfaces/IHorario.service';

 
@controller("/horario")    
export class HorarioController implements interfaces.Controller {    
 
    constructor( @inject(TYPES.IHorarioService) private horarioService: IHorarioService) {}
 
    @httpGet("/",verificaToken)
    private async listar(req: express.Request, res: express.Response, next: express.NextFunction) {
        let horarios = await this.horarioService.listar();
        return res.status(200).json({
            ok: true,
            horarios: horarios
        });
    }
    @httpGet("/:id",verificaToken)
    private async buscar(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const horario = await this.horarioService.buscar(id); 
            if (!horario) {   
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe un horario con el ID ${id}`
                });
            }
            return res.status(201).json({
                ok: true,
                mensaje: 'Horario encontrado',
                horario: horario,
            });
        } catch (err) {
            res.status(400).json({ 
                ok: false,
                error: err.message 
            });
        }
    }

   
   

}