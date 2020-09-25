import * as express from "express";
import { interfaces, controller, httpGet, response, requestParam} from "inversify-express-utils";
import { inject } from "inversify";
import { TYPES } from "../../config/types";
import verificaToken from '../middlewares/verificar-token';
import { IIdiomaService } from '../interfaces/idioma.service';
import { INivelIdiomaService } from '../interfaces/nivel-idioma.service';
 
@controller("/idioma")    
export class IdiomaController implements interfaces.Controller {  
 
    constructor( @inject(TYPES.IIdiomaService) private idiomaService: IIdiomaService,
                 @inject(TYPES.INivelIdiomaService) private nivel_idiomaService: INivelIdiomaService ) {}
 
    @httpGet("/",verificaToken)
    private async listar(req: express.Request, res: express.Response, next: express.NextFunction) {
        let idiomas = await this.idiomaService.listar();
        return res.status(200).json({
            ok: true,
            idiomas: idiomas
        });
    }
    @httpGet("/nivel/",verificaToken)
    private async listarNiveles(req: express.Request, res: express.Response, next: express.NextFunction) {
        let niveles = await this.nivel_idiomaService.listar();
        return res.status(200).json({
            ok: true,
            niveles_idioma: niveles
        });
    }
    @httpGet("/:id",verificaToken)
    private async buscar(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const idioma = await this.idiomaService.buscar(id); 
            if (!idioma) {   
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe un idioma con el ID ${id}`
                });
            }
            return res.status(201).json({
                ok: true,
                mensaje: 'Idioma encontrado',
                idioma: idioma,
            });
        } catch (err) {
            res.status(400).json({ 
                ok: false,
                error: err.message 
            });
        }
    }

    @httpGet("/nivel/:id",verificaToken)
    private async buscarNivel(@requestParam("id") id: number, @response() res: express.Response) {
        try {
            const nivel_idioma = await this.idiomaService.buscar(id); 
            if (!nivel_idioma) {   
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe un nivel de idioma con el ID ${id}`
                });
            }
            return res.status(201).json({
                ok: true,
                mensaje: 'Nivel de Idioma encontrado',
                nivel_idioma: nivel_idioma,
            });
        } catch (err) {
            res.status(400).json({ 
                ok: false,
                error: err.message 
            });
        }
    }

   

}