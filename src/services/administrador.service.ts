import { injectable } from 'inversify';

import { getRepository,getConnection  } from "typeorm";
import { Administrador } from "../entity/administrador";
import { Credenciales } from '../entity/credenciales';

import bcrypt from 'bcryptjs';
import { Imagen } from '../entity/imagen';
import { IAdministradorService } from '../interfaces/IAdministrador.service';

@injectable()
class AdministradorService implements IAdministradorService  {
    
    
    async buscarPorCredencial(id: number) {
        const administrador = await  getRepository(Administrador)  
        .createQueryBuilder("administrador")
        .leftJoinAndSelect("administrador.imagen", "imagen")
        .where("administrador.credenciales_id = :id", { id: id })  
        .getOne();
        return administrador;
    }  
    async listar(desde: number) {
        const administradores = await getRepository(Administrador)
        .createQueryBuilder("administradores")
        .skip(desde)  
        .take(5)
        .getMany();
        return administradores ;
    }
    async adicionar(body: any) {
        let respuesta: boolean;
        const connection = getConnection();
            const queryRunner = connection.createQueryRunner();

            // establish real database connection using our new query runner
            await queryRunner.connect();

            // lets now open a new transaction:
            await queryRunner.startTransaction();
            try {
                // execute some operations on this transaction:
                let credencial= await queryRunner.manager.save(Credenciales, 
                    {email: body.email, 
                     password: bcrypt.hashSync(body.password,10) ,
                     rol: {id: body.id_rol}
                    });
                let imagen = await queryRunner.manager.save(Imagen, 
                    { id_cloudinary: 'no-image2_uyivib',
                      formato: 'png',
                      url: 'http://res.cloudinary.com/dl8ifr7sr/image/upload/v1595442138/no-image2_uyivib.png',
                      url_segura: 'https://res.cloudinary.com/dl8ifr7sr/image/upload/v1595442138/no-image2_uyivib.png'});
                
                let admin = await queryRunner.manager.save(Administrador,
                    {nombre:body.nombre, 
                    apellidos: body.apellidos, 
                    imagen: imagen,
                    telefono: body.telefono, 
                    cedula: body.cedula, 
                    num_complemento_ci: body.num_complemento_ci,
                    genero: body.genero, 
                    habilitado: body.habilitado,
                    direccion: body.direccion,
                    ciudad: {id: body.id_ciudad},
                    credenciales: credencial})
                await queryRunner.commitTransaction();

                admin.credenciales.password = 'xd';
                respuesta = true;
                
            
            } catch (err) {
            
                // since we have errors let's rollback changes we made
                await queryRunner.rollbackTransaction();
                respuesta = err;
            
            } finally {
            
                // you need to release query runner which is manually created:
                await queryRunner.release();
            }

            return respuesta;
    }
    async modificarImagen(id: number, imagen: Imagen) {
        const admin = await getRepository(Administrador)
        .createQueryBuilder()
        .update(Administrador)
        .set({imagen: imagen})
        .where("id = :id", { id: id })
        .execute();
        return admin;
    }
    async modificar(administrador: Administrador, body: any) {
        let habilitar: boolean;
        if(body.habilitado === 'true' || body.habilitado === true) {
            habilitar = true;
        }else {
            habilitar = false;
        }
        const admin = await getRepository(Administrador)
        .createQueryBuilder()
        .update(Administrador)
        .set({nombre:body.nombre, 
            apellidos: body.apellidos,
            telefono: body.telefono, 
            cedula: body.cedula, 
            num_complemento_ci: body.num_complemento_ci,
            genero: body.genero,
            direccion: body.direccion,
            ciudad: {id: body.id_ciudad},
            modificado_en: new Date(),
            habilitado: habilitar})
        .where("id = :id", { id: administrador.id })
        .execute();
        const credencial = await getRepository(Credenciales)
        .createQueryBuilder()
        .update(Credenciales)
        .set({email: body.email})
        .where("id = :id", { id: administrador.credenciales.id})
        .execute();
        console.log(admin);
        return admin;
    }
    async inhabilitar(id: number) {
        const admin = await getRepository(Administrador)
        .createQueryBuilder()
        .update(Administrador)
        .set({ 
            habilitado: false})
        .where("id = :id", { id: id })
        .execute(); 
        return admin;
    }
    async habilitar(id: number) {
        const admin = await getRepository(Administrador)
        .createQueryBuilder()
        .update(Administrador)
        .set({ 
            habilitado: true})
        .where("id = :id", { id: id })
        .execute(); 
        return admin;
    }
    async buscar(id: number) {
        const administrador = await  getRepository(Administrador).findOne(id);
        if(administrador){
            administrador.credenciales.password = 'xd';
        }
        return administrador;
    } 
    async contar() {
        const total = await getRepository(Administrador)
        .createQueryBuilder("administradores").getCount()
        return total;
    }
    async buscarPorValor(nombre: string) {
        const administradores =  await getRepository(Administrador)
        .createQueryBuilder("administradores")
        .where("administradores.nombre regexp :nombre || administradores.apellidos regexp :nombre || administradores.cedula regexp :nombre",{nombre: nombre})
        .getMany()
        return administradores;
     }
}
export { AdministradorService };   