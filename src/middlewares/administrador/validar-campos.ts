import { validationResult } from 'express-validator';

let validarCampos = function(req: any, res: any , next: any) { 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
          ok : false, 
          errors: errors.array() 
        });
    }
    next();
}; 

export default validarCampos;