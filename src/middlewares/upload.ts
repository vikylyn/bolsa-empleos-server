/*import multer from 'multer';
import path from 'path';
import Server from '../../classes/server';





let subirImagen = function(request: any, res: any , next: any) {
    
    const storage = multer.diskStorage({
        destination: 'src/public/uploads',
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    })
    
    const upload = multer ({
        storage,
        dest: 'src/public/uploads',
        limits: {fieldSize: 1000000},
        fileFilter: (req, file,cb) => {
            const filetypes = /jpeg|jpg|png|gif/;
            const mimetype = filetypes.test(file.mimetype);
            const extname = filetypes.test(path.extname(file.originalname));
            if (mimetype && extname) {
                console.log('primero')  
                console.log(request.params.tipo)
                next();
                return cb(null, true);
                
            }
            
            return res.status(401).json({
                ok: false,
                mensaje: 'incorrecto',
            });
            //return cb(null, false);
        }   
    })
}; 

export default subirImagen;
 */

let subirImagen = function(req: any, res: any , next: any) {

        if( !req.files) {     
            return res.status(400).json({
                ok: false,
                mensaje: 'Debe seleccionar una imagen',
                errors: { message: 'Debe seleccionar una imagen'}
     
            });
        } else {
            next();
        } 
        
        

    };
export default subirImagen;