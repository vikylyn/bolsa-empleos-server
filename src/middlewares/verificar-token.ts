import {Router, Request, Response} from 'express';
import jwt from'jsonwebtoken';
import { SEED } from '../../config/config';

// *********
// Verificar token
// *********  
let verificaToken = function(req: any, res: any , next: any) {
    let token = req.query.token;
    jwt.verify( token, SEED, (err: any, decoded: any ) => {
        if( err ) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }
        req.usuario = decoded.usuario;
      //  console.log(decoded.usuario);
        next();
    });
}; 
  
export default verificaToken;
