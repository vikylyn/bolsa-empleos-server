import { injectable, inject } from 'inversify';

import { getRepository,getConnection  } from "typeorm";
import { IAdministradorService } from '../interfaces/administrador.service';
import { Administrador } from "../entity/administrador";
import { Credenciales } from '../entity/credenciales';

import bcrypt from 'bcryptjs';

@injectable()
class AdministradorRepository implements IAdministradorService  {
    
    async buscarPorCredencial(id: number) {
        const administrador = await  getRepository(Administrador)  
        .createQueryBuilder("administrador")
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
    async adicionar(administrador: Administrador) {
        let adm: any;
        const connection = getConnection();
            const queryRunner = connection.createQueryRunner();

            // establish real database connection using our new query runner
            await queryRunner.connect();

            // lets now open a new transaction:
            await queryRunner.startTransaction();
            try {
                // execute some operations on this transaction:
                let credencial= await queryRunner.manager.save(Credenciales, 
                    {email: administrador.credenciales.email, 
                     password: bcrypt.hashSync(administrador.credenciales.password,10) ,
                     rol: administrador.credenciales.rol
                    });
                let admin = await queryRunner.manager.save(Administrador,
                    {nombre:administrador.nombre, 
                    apellidos: administrador.apellidos, 
                    imagen: administrador.imagen,
                    telefono: administrador.telefono, 
                    cedula: administrador.cedula, 
                    genero: administrador.genero, 
                    habilitado: administrador.habilitado,
                    credenciales: credencial})
                await queryRunner.commitTransaction();

                admin.credenciales.password = 'xd';
                adm = admin;
                
            
            } catch (err) {
            
                // since we have errors let's rollback changes we made
                await queryRunner.rollbackTransaction();
                adm = err;
            
            } finally {
            
                // you need to release query runner which is manually created:
                await queryRunner.release();
            }

            return adm;
    }
    async modificar(id: number, administrador: Administrador) {
        const admin = await getRepository(Administrador)
        .createQueryBuilder()
        .update(Administrador)
        .set({nombre:administrador.nombre, 
            apellidos: administrador.apellidos, 
            imagen: administrador.imagen,
            telefono: administrador.telefono, 
            cedula: administrador.cedula, 
            genero: administrador.genero, 
            habilitado: administrador.habilitado})
        .where("id = :id", { id: id })
        .execute();
        const credencial = await getRepository(Credenciales)
        .createQueryBuilder()
        .update(Credenciales)
        .set({email: administrador.credenciales.email, password: administrador.credenciales.password})
        .where("id = :id", { id: administrador.credenciales.id })
        .execute();
        return admin;
    }
    async eliminar(id: number) {
        const admin = await getRepository(Administrador)
        .createQueryBuilder()
        .update(Administrador)
        .set({ 
            habilitado: false})
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

}
export { AdministradorRepository };  