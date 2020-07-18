import { injectable, inject } from 'inversify';

import { getRepository,getConnection  } from "typeorm";
import { Credenciales } from '../entity/credenciales';

import bcrypt from 'bcryptjs';
import { ISolicitanteService } from '../interfaces/solicitante.service';
import { Solicitante } from '../entity/solicitante';
import { stringify } from 'querystring';

@injectable()
class SolicitanteRepository implements ISolicitanteService  {

    async buscarPorCredencial(id: number) {
        const solicitante = await  getRepository(Solicitante) 
        .createQueryBuilder("solicitante")
        .where("solicitante.credenciales_id = :id", { id: id })  
        .getOne();
        return solicitante;
    }  
    async listar(desde: number) {
        const solicitantes = await getRepository(Solicitante)
        .createQueryBuilder("solicitantes")
        .skip(desde)  
        .take(5)
        .getMany();
        return solicitantes ;
    }
    async adicionar(solicitante: Solicitante) {
        let respuesta: any;
        const connection = getConnection();
            const queryRunner = connection.createQueryRunner();

            // establish real database connection using our new query runner
            await queryRunner.connect();

            // lets now open a new transaction:
            await queryRunner.startTransaction();
            try {
                // execute some operations on this transaction:
                let credencial= await queryRunner.manager.save(Credenciales, 
                    {email: solicitante.credenciales.email, 
                     password: bcrypt.hashSync(solicitante.credenciales.password,10) ,
                     rol: solicitante.credenciales.rol
                    });
                let solicitante_guardado = await queryRunner.manager.save(Solicitante,
                    {
                    nombre:solicitante.nombre, 
                    apellidos: solicitante.apellidos, 
                    imagen: solicitante.imagen,
                    telefono: solicitante.telefono, 
                    cedula: solicitante.cedula, 
                    genero: solicitante.genero, 
                    habilitado: false,
                    nacionalidad: solicitante.nacionalidad,
                    direccion:solicitante.direccion,
                //   creado_en: solicitante.creado_en,
                    ocupado: false,
                    estado_civil: solicitante.estado_civil,
                    ciudad: solicitante.ciudad,
                    profesion: solicitante.profesion,
                    credenciales: credencial})
                await queryRunner.commitTransaction();

                solicitante_guardado.credenciales.password = 'xd';
                respuesta = solicitante_guardado;
                
            
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
    async modificar(id: number, solicitante: Solicitante) {
        const solicitante_modificado = await getRepository(Solicitante)
        .createQueryBuilder()
        .update(Solicitante)
        .set({
            nombre:solicitante.nombre, 
            apellidos: solicitante.apellidos, 
            imagen: solicitante.imagen,
            telefono: solicitante.telefono, 
            cedula: solicitante.cedula, 
            genero: solicitante.genero, 
            habilitado: solicitante.habilitado,
            nacionalidad: solicitante.nacionalidad,
            direccion:solicitante.direccion,
            ocupado: solicitante.ocupado,
            estado_civil: solicitante.estado_civil,
            ciudad: solicitante.ciudad,
            profesion: solicitante.profesion,
        })
        .where("id = :id", { id: id })
        .execute();
        const credencial = await getRepository(Credenciales)
        .createQueryBuilder()
        .update(Credenciales)
        .set({email: solicitante.credenciales.email})
        .where("id = :id", { id: solicitante.credenciales.id })
        .execute();
        return solicitante_modificado;
    }
    async eliminar(id: number) {
        const respuesta = await getRepository(Solicitante)
        .createQueryBuilder()
        .update(Solicitante)
        .set({ 
            habilitado: false,
            ocupado: false})
        .where("id = :id", { id: id })
        .execute(); 
        return respuesta;
    }
    async buscar(id: number) {
        const solicitante = await  getRepository(Solicitante).findOne(id);
        if(solicitante){
            solicitante.credenciales.password = 'xd' 
        }
        return solicitante;
    } 

    async activar_ocupacion(id: number) {
        const respuesta = await getRepository(Solicitante)
        .createQueryBuilder()
        .update(Solicitante)
        .set({ocupado: true})
        .where("id = :id", { id: id })
        .execute(); 
        return respuesta;
    }
    async desactivar_ocupacion(id: number) {
        const respuesta = await getRepository(Solicitante)
        .createQueryBuilder()
        .update(Solicitante)
        .set({ocupado: false})
        .where("id = :id", { id: id })
        .execute(); 
        return respuesta;
    }

    

}
export { SolicitanteRepository };  