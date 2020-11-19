import * as express from "express";
import { interfaces, controller, httpGet, httpPost, request, response, requestParam, httpPut, queryParam } from 'inversify-express-utils';
import { inject } from "inversify";
import { TYPES } from "../config/types";
import { IAdministradorService } from '../interfaces/administrador.service';
import verificaToken from '../middlewares/verificar-token'

import fs from 'fs-extra';
import { ISolicitanteService } from '../interfaces/solicitante.service';

import path from 'path';
import { IImagenService } from '../interfaces/imagen.service';
import { Imagen } from '../entity/imagen';
import multer from '../libs/multer'
import { IEmpleadorService } from '../interfaces/empleador.service';
import { IEmpresaService } from '../interfaces/empresa.service';
import { Empresa } from '../entity/empresa';
import { Empleador } from '../entity/empleador';
import { cloud_name, api_key, api_secret } from '../global/environments';
var cloudinary = require('cloudinary');
cloudinary.config({ 
    cloud_name: cloud_name, 
    api_key: api_key, 
    api_secret: api_secret 
  });

@controller("/upload")    
export class UploadController implements interfaces.Controller { 
    
    
 
    constructor( @inject(TYPES.IAdministradorService) private adminService: IAdministradorService,
                 @inject(TYPES.ISolicitanteService) private solicitanteService: ISolicitanteService,
                 @inject(TYPES.IImagenService) private imagenService: IImagenService,
                 @inject(TYPES.IEmpleadorService) private empleadorService: IEmpleadorService,
                 @inject(TYPES.IEmpresaService) private empresaService: IEmpresaService) {}
    
    @httpGet("/:id",verificaToken)
    private async verImagen(@requestParam("id") id: number,@request() req: express.Request, @response() res: express.Response) {
        try {
            const imagen: Imagen= await this.imagenService.buscar(id);
            if (!imagen) {
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe un imagen del solicitante con el ID ${id}`
                });
            }
            return res.status(200).json({
                ok: true,
                imagen,
            });
        } catch (err) {
            res.status(400).json({
                ok: false, 
                error: err.message 
            });
        }
                  
    } ; 
 /*   @httpPut("/solicitante/:id", subirImagen)  
    private async cambiarImagen(@requestParam("tipo") tipo: string,@requestParam("id") id: number,@request() req: express.Request, @response() res: express.Response) {
                    
         
        // Obtener nombre del archivo
        let archivo: any = req.files.image;  
 
        let nombreCortado = archivo.name.split('.');
        let extensionArchivo = nombreCortado[nombreCortado.length -1];     
        // solo estas extensiones aceptamos
        var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];      
        if( extensionesValidas.indexOf( extensionArchivo) < 0){
            return res.status(400).json({
                ok: false,
                mensaje: 'extension no valida',
                errors: { message: 'Las extensiones validas son '+ extensionesValidas.join(', ')}

            });
        }
       

        // Nombre de archivo personalizado id-milisegundos.extension
       

        // Mover el archivo del temporal a un path
        let pathImg = path.join(__dirname,  `../uploads/${ nombreArchivo }`);
        console.log(pathImg);
     
        archivo.mv( pathImg, async (err: any) => {

            if( err ) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al mover archivo',  
                    errors: err
                
                });
            }
           
              
        });

        
     
           if(tipo === 'administrador') {
                    try {

                    
                    
                        const administrador = await this.adminService.buscar(id);
                        if (!administrador) {
                            return res.status(400).json({
                                ok: false,
                                mensaje:`No existe un administrador con ese ID ${id}`
                            });
                        }
                    
                    
                        let result = await cloudinary.v2.uploader.upload(pathImg);  
                        administrador.imagen = result.url;
                        var pathTemporal =  path.join(__dirname,  `../uploads/${ nombreArchivo }`);
                        if ( fs.existsSync(pathTemporal)) {
                         fs.unlink(pathTemporal, () => {});
                        
                        }
                        const administrador_modificado = await this.adminService.modificarImagen(administrador.id, administrador.imagen);
                    
                        if (administrador_modificado.affected === 1){
                            return res.status(200).json({
                                ok:true,
                                mensaje: 'Imagen modificada exitosamente'
                            });
                        }else {
                            return res.status(400).json({
                                ok: false,
                                mensaje: 'Error al modificar Imagen',
                            });
                        }


                    } catch (error) {
                        console.log(error);
                    }
           }
           if (tipo === 'solicitante') {
            try {
                const solicitante = await this.solicitanteService.buscar(id);
                if (!solicitante){
                    return res.status(400).json({
                        ok: false,
                        mensaje:`No existe un solicitante con ese ID ${id}`
                    });
                }
                let resultSolicitante = await cloudinary.v2.uploader.upload(pathImg); 
                console.log(resultSolicitante)

               // const solicitante = await this.solicitanteService.buscar(id);

                
                var pathTemporal =  path.join(__dirname,  `../uploads/${ nombreArchivo }`);

                if ( fs.existsSync(pathTemporal)) {
                 fs.unlink(pathTemporal, () => {});
                
                }
                if(solicitante.imagen.id_cloudinary != 'no-image2_uyivib') {
                    let eliminar = await cloudinary.uploader.destroy(solicitante.imagen.id_cloudinary);
                }
                
                const imagen = await this.imagenService.buscar(solicitante.imagen.id);
                
                imagen.id_cloudinary = resultSolicitante.public_id;
                imagen.formato = resultSolicitante.format;
                imagen.url_segura = resultSolicitante.secure_url;
                imagen.url = resultSolicitante.url;
                
                const imagen_modificada = await this.imagenService.modificar(solicitante.imagen.id,imagen);
                solicitante.imagen = imagen;

                const solicitante_modificado = await this.solicitanteService.modificar(solicitante.id, solicitante);
                if (solicitante_modificado.affected === 1){
                    return res.status(200).json({
                        ok:true,
                        mensaje: 'Imagen modificada exitosamente'
                    });
                }else {
                    
                    return res.status(400).json({
                        ok:false,
                        mensaje: 'Error al modificar imagen'
                    });
                }
            } catch (err) {
                res.status(400).json({  
                    ok:false, 
                    error: err.message });
            }
        }
       



  
                
    }
*/
    async subirImagen(url:string, id: number , res: express.Response) {
        try {
            
        } catch (err) {
                res.status(400).json({  
                ok:false, 
                error: err.message });
        }
    }
@httpPut("/administrador/:id",multer.single('image'))  
    private async cambiarImagenAdministrador(@requestParam("tipo") tipo: string,@requestParam("id") id: number,@request() req: express.Request, @response() res: express.Response) {
                
        console.log(req.file.path);
      

   
    try {
        const administrador = await this.adminService.buscar(id);
        if (!administrador) {
            return res.status(400).json({
                ok: false,
                mensaje:`No existe un administrador con ese ID ${id}`
            });
        }
    
        // subiendo a cloudinary
        let resultAdministrador = await cloudinary.v2.uploader.upload(req.file.path); 
        console.log(resultAdministrador)
        // borrando imagen de la app
        await fs.unlink(path.resolve(req.file.path))

        if(administrador.imagen.id_cloudinary != 'no-image2_uyivib') {
            let eliminar = await cloudinary.uploader.destroy(administrador.imagen.id_cloudinary);
        }
        
        const imagen = await this.imagenService.buscar(administrador.imagen.id);
        
        imagen.id_cloudinary = resultAdministrador.public_id;
        imagen.formato = resultAdministrador.format;
        imagen.url_segura = resultAdministrador.secure_url;
        imagen.url = resultAdministrador.url;
        
        const imagen_modificada = await this.imagenService.modificar(imagen.id,imagen);
        administrador.imagen = imagen;

        const administrador_modificado = await this.adminService.modificarImagen(administrador.id, administrador.imagen);
        if (administrador_modificado.affected === 1){
            return res.status(200).json({
                ok:true,
                mensaje: 'Imagen modificada exitosamente',
                imagen: administrador.imagen
            });
        }else {
            
            return res.status(400).json({
                ok:false,
                mensaje: 'Error al modificar imagen'
            });
        }

    } catch (error) {
        console.log(error);
    }           
  }

  @httpPut("/solicitante/:id",multer.single('image'))  
    private async cambiarImagenSolicitante(@requestParam("tipo") tipo: string,@requestParam("id") id: number,@request() req: express.Request, @response() res: express.Response) {
                

    try {
        const solicitante = await this.solicitanteService.buscar(id);
        if (!solicitante) {
            return res.status(400).json({
                ok: false,
                mensaje:`No existe un solicitante con ese ID ${id}`
            });
        }
    
        // subiendo a cloudinary
        let resultSolicitante = await cloudinary.v2.uploader.upload(req.file.path); 
        console.log(resultSolicitante)
        // borrando imagen de la app
        await fs.unlink(path.resolve(req.file.path))

        if(solicitante.imagen.id_cloudinary != 'no-image2_uyivib') {
            let eliminar = await cloudinary.uploader.destroy(solicitante.imagen.id_cloudinary);
        }
        
        const imagen = await this.imagenService.buscar(solicitante.imagen.id);
        
        imagen.id_cloudinary = resultSolicitante.public_id;
        imagen.formato = resultSolicitante.format;
        imagen.url_segura = resultSolicitante.secure_url;
        imagen.url = resultSolicitante.url;
        
        const imagen_modificada = await this.imagenService.modificar(imagen.id,imagen);
        solicitante.imagen = imagen;

        const solicitante_modificado = await this.solicitanteService.modificarImagen(solicitante.id, solicitante.imagen);
        if (solicitante_modificado.affected === 1){
            return res.status(200).json({
                ok:true,
                mensaje: 'Imagen modificada exitosamente',
                imagen: solicitante.imagen
            });
        }else {
            
            return res.status(400).json({
                ok:false,
                mensaje: 'Error al modificar imagen'
            });
        }

    } catch (error) {
        console.log(error);
    }           
  }
  @httpPut("/empleador/:id",multer.single('image'))  
  private async cambiarImagenEmpleador(@requestParam("id") id: number,@request() req: express.Request, @response() res: express.Response) {
              

  try {
      const empleador: Empleador = await this.empleadorService.buscar(id);
      if (!empleador) {
          return res.status(400).json({
              ok: false,
              mensaje:`No existe un empleador con el ID ${id}`
          });
      }
  
      // subiendo a cloudinary
      let resultEmpleador = await cloudinary.v2.uploader.upload(req.file.path); 
      console.log(resultEmpleador)
      // borrando imagen de la app
      await fs.unlink(path.resolve(req.file.path))

      if(empleador.imagen.id_cloudinary != 'no-image2_uyivib') {
          let eliminar = await cloudinary.uploader.destroy(empleador.imagen.id_cloudinary);
      }
      
      const imagen = await this.imagenService.buscar(empleador.imagen.id);
      
      imagen.id_cloudinary = resultEmpleador.public_id;
      imagen.formato = resultEmpleador.format;
      imagen.url_segura = resultEmpleador.secure_url;
      imagen.url = resultEmpleador.url;
      
      const imagen_modificada = await this.imagenService.modificar(imagen.id,imagen);
      empleador.imagen = imagen;

      const empleado_modificado = await this.empleadorService.modificarImagen(empleador.id, empleador.imagen);
      if (empleado_modificado.affected === 1){
          return res.status(200).json({
              ok:true,
              mensaje: 'Imagen modificada exitosamente',
              imagen: empleador.imagen
          });
      }else {
          
          return res.status(400).json({
              ok:false,
              mensaje: 'Error al modificar imagen'
          });
      }

  } catch (error) {
      console.log(error);
  }           
}
@httpPut("/empresa/:id",multer.single('image'))  
private async cambiarImagenEmpresa(@requestParam("id") id: number,@request() req: express.Request, @response() res: express.Response) {
            

        try {
            const empresa: Empresa = await this.empresaService.buscar(id);
            if (!empresa) {
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe una con el ID ${id}`
                });
            }

            // subiendo a cloudinary
            let resultEmpresa = await cloudinary.v2.uploader.upload(req.file.path); 
            console.log(resultEmpresa)
            // borrando imagen de la app
            await fs.unlink(path.resolve(req.file.path))

            if(empresa.logo.id_cloudinary != 'no-image2_uyivib') {
                let eliminar = await cloudinary.uploader.destroy(empresa.logo.id_cloudinary);
            }

            const imagen = await this.imagenService.buscar(empresa.logo.id);

            imagen.id_cloudinary = resultEmpresa.public_id;
            imagen.formato = resultEmpresa.format;
            imagen.url_segura = resultEmpresa.secure_url;
            imagen.url = resultEmpresa.url;

            const imagen_modificada = await this.imagenService.modificar(imagen.id,imagen);
            empresa.logo = imagen;

            const solicitante_modificado = await this.empresaService.modificarImagen(empresa.id, empresa.logo);
            if (solicitante_modificado.affected === 1){
                return res.status(200).json({
                    ok:true,
                    mensaje: 'Imagen modificada exitosamente',
                    imagen: empresa.logo
                });
            }else {

                return res.status(400).json({
                    ok:false,
                    mensaje: 'Error al modificar imagen'
                });
            }

        } catch (error) {
            console.log(error);
        }           
    }
}