import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Rol } from '../entity/rol';

export const listarRoles = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    let body = req.body;  
    const roles =  await getRepository(Rol).find();
    return res.status(200).json({roles: roles})  
};

export const buscarRoles = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    let id = req.params.id;
    const rol =  await getRepository(Rol).findOne(id);
    if (!rol){
      return res.status(400).json({
        mensaje:`No existe un rol con ese ID ${id}`
    });
    }
    return res.status(200).json({
        rol
    }); 
};

export const adicionarRoles = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    let body = req.body;
    
    try {
      const nuevoRol = getRepository(Rol).create({nombre: body.nombre})
      const rol =  await getRepository(Rol).save(nuevoRol);
      return res.status(201).json({
          rol
      });
    } catch (error) {
      return res.status(500).json({
        mensaje: 'Error al adicionar rol',
        error: error
      });
    }

};

export const modificarRoles = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    let body = req.body;
    let id = req.params.id;
    try {
     
      const rol =  await getRepository(Rol).findOne(id);

      if (rol) {
          getRepository(Rol).merge(rol,{nombre: body.nombre});
          const results = await getRepository(Rol).save(rol);
          return res.status(200).json({
              rol: results
          });
      } 
    
      return  res.status(400).json({
        mensaje: `No existe un rol con el ID ${id}`
      });
    } catch (error) {
      return  res.status(400).json({
        mensaje: `Error al modificar rol`
      });
    }

  
};


// Verificar si se implementara en el proyecto
export const borrarRoles = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    let body = req.body;
    let id = req.params.id;
    const results =  await getRepository(Rol).delete(id);
    if( results.affected === 0){
      return res.status(400).json({
        mensaje: `No se pudo borrar el rol, puede que no exista un rol con el Id ${id}`
    });
    }
    return res.status(200).json({
        mensaje: 'Rol eliminado'
    }); 
    
   
};
