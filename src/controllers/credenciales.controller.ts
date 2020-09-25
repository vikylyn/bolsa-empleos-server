import * as express from "express";
import { interfaces, controller, httpGet, httpPost, request, response, requestParam, httpPut, queryParam } from 'inversify-express-utils';
import { inject } from "inversify";
import { TYPES } from "../../config/types";
import verificaToken from '../middlewares/verificar-token'
import validarCampos from '../middlewares/administrador/validar-campos';
import { body } from 'express-validator';
import { ICredencialesService } from '../interfaces/creadenciales.service';


@controller("/credenciales")    
export class CredencialesController implements interfaces.Controller {    
 
    constructor(@inject(TYPES.ICredencialesService) private credencialesService: ICredencialesService) {}
    
    // mover a un credencialesController

    @httpPut("/:id",
        verificaToken,
        body('email', 'El email es obligatorio').isEmail(),
        body('password', 'El password es Obligatorio').not().isEmpty(),
        validarCampos
        )  
    private async modificar(@requestParam("id") id: number,@request() req: express.Request, @response() res: express.Response) {
        try {
            const credencial = await this.credencialesService.modificar(id,req.body);
           
            if (credencial.affected === 1){
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Credencales modificadas exitosamente',
                    credencial: credencial
                });
            }else {
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Error al modificar credenciales',
                });
            }
        } catch (err) {
            res.status(400).json({ 
                ok: false,  
                error: err.message });  
        }
    }
 

 
  

}