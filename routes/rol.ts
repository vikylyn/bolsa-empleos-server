import {Request, Response, Router} from 'express';
import {getRepository} from 'typeorm';
import { Rol } from '../entity/rol';
const rol = Router();


// **********
// adicionar rol
// ********* 

rol.get('/', async (req: Request, res:Response , next) => {
    let body = req.body;
   const roles =  await getRepository(Rol).find();
   return res.json({
       roles:roles
   });
   
} ); 

rol.get('/:id', async (req: Request, res:Response , next) => {
   let id = req.params.id;
   const rol =  await getRepository(Rol).findOne(id);
   return res.json({
       rol
   });
   
} ); 

rol.post('/', async (req: Request, res:Response , next) => {
   let body = req.body;
   const nuevoRol = getRepository(Rol).create({nombre: body.nombre})
   const rol =  await getRepository(Rol).save(nuevoRol);
   return res.json({
       rol
   });
   
}); 

rol.put('/:id', async (req: Request, res:Response , next) => {
    let body = req.body;
    let id = req.params.id;
    const rol =  await getRepository(Rol).findOne(id);
    if (rol) {
        getRepository(Rol).merge(rol,{nombre: body.nombre});
        const results = await getRepository(Rol).save(rol);
        return res.json({
            rol: results
        });
    }
    if (!rol) {
        return res.status(404).json({
            mensaje: `No existe un rol con el ID ${id}`
        });
    }
    //const rol =  await getRepository(Rol).save(nuevoRol);
    
    
 }); 

 rol.delete('/:id', async (req: Request, res:Response , next) => {
    let body = req.body;
    let id = req.params.id;
    const results =  await getRepository(Rol).delete(id);
    return res.json({
        rol: results
    });  
    
 }); 

export default rol;
