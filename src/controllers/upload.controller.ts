import * as express from "express";
import { interfaces, controller, httpGet, httpPost, request, response, requestParam, httpPut, queryParam } from 'inversify-express-utils';
import { inject } from "inversify";
import { TYPES } from "../config/types";
import { IAdministradorService } from '../interfaces/IAdministrador.service';
import verificaToken from '../middlewares/verificar-token'

import fs from 'fs-extra';
import { ISolicitanteService } from '../interfaces/ISolicitante.service';

import path from 'path';
import { IImagenService } from '../interfaces/IImagen.service';
import { Imagen } from '../entity/imagen';
import multer from '../libs/multer'
import { IEmpleadorService } from '../interfaces/IEmpleador.service';
import { IEmpresaService } from '../interfaces/IEmpresa.service';
import { Empresa } from '../entity/empresa';
import { Empleador } from '../entity/empleador';
import { cloud_name, api_key, api_secret } from '../global/environments';
import { InformacionApp } from '../entity/informacionApp';
import { IInformacionAppService } from '../interfaces/IInformacionApp.service';
import Server from '../classes/server';
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
                 @inject(TYPES.IInformacionAppService) private infoService: IInformacionAppService,
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
        if (imagen_modificada.affected === 1){
            return res.status(200).json({
                ok:true,
                mensaje: 'Imagen modificada exitosamente',
                imagen: imagen
            });
          }else {
      
              return res.status(500).json({
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
        if (imagen_modificada.affected === 1){
            return res.status(200).json({
                ok:true,
                mensaje: 'Imagen modificada exitosamente',
                imagen: imagen
            });
          }else {
      
              return res.status(500).json({
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

      if (imagen_modificada.affected === 1){
        return res.status(200).json({
            ok:true,
            mensaje: 'Imagen modificada exitosamente',
            imagen: imagen
        });
      }else {
  
          return res.status(500).json({
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
          
            if (imagen_modificada.affected === 1){
                return res.status(200).json({
                    ok:true,
                    mensaje: 'Imagen modificada exitosamente',
                    imagen: imagen
                });
            }else {

                return res.status(500).json({
                    ok:false,
                    mensaje: 'Error al modificar imagen'
                });
            }

        } catch (error) {
            console.log(error);
        }           
    }
    @httpPut("/logo-app/:id",multer.single('image'))  
    private async cambiarLogoApp(@requestParam("id") id: number,@request() req: express.Request, @response() res: express.Response) {
            

        try {
            const informacion: InformacionApp = await this.infoService.buscar(id);
            if (!informacion) {
                return res.status(400).json({
                    ok: false,
                    mensaje:`No existe una apliacacion con el ID ${id}`
                });
            }

            // subiendo a cloudinary
            let resultInfoLogo = await cloudinary.v2.uploader.upload(req.file.path); 
          
            // borrando imagen de la app
            await fs.unlink(path.resolve(req.file.path))

            if(informacion.imagen.id_cloudinary != 'no-image2_uyivib') {
                await cloudinary.uploader.destroy(informacion.imagen.id_cloudinary);
            }

            const imagen = await this.imagenService.buscar(informacion.imagen.id);

            imagen.id_cloudinary = resultInfoLogo.public_id;
            imagen.formato = resultInfoLogo.format;
            imagen.url_segura = resultInfoLogo.secure_url;
            imagen.url = resultInfoLogo.url;

            const imagen_modificada = await this.imagenService.modificar(imagen.id,imagen);
            const server = Server.instance;      
            server.io.emit('actualizando-informacion-app');    
               
            if (imagen_modificada.affected === 1){
                return res.status(200).json({
                    ok:true,
                    mensaje: 'Logo modificado exitosamente',
                    imagen: informacion.imagen
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