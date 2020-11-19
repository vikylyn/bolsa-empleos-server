import * as express from "express";
import { interfaces, controller, httpGet, response, requestParam} from "inversify-express-utils";
import { inject } from "inversify";
import { IRolService } from '../interfaces/rol.service';
import { TYPES } from "../config/types";
import verificaToken from '../middlewares/verificar-token';
 
@controller("/rol")    
export class RolController implements interfaces.Controller {  
 
    constructor( @inject(TYPES.IRolService) private rolI: IRolService ) {}
 
    @httpGet("/",verificaToken)
    private async listar(req: express.Request, res: express.Response, next: express.NextFunction) {
        let roles = await this.rolI.listar();
        return res.status(200).json({
            ok: true,
            roles: roles
        })
    }
    @httpGet("/:id",verificaToken)
    private async buscar(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const rol = await this.rolI.buscar(id); 
            if (!rol){   
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe un rol con ese ID ${id}`
            });
            }
            return res.status(201).json({
                ok: true,
                mensaje: 'Rol encontrado',
                rol: rol,
            });
        } catch (err) {
            res.status(400).json({ 
                ok: false,
                error: err.message 
            });
        }
    }

}