import { injectable, inject } from 'inversify';

import { getRepository,getConnection  } from "typeorm";
import { Credenciales } from '../entity/credenciales';

import bcrypt from 'bcryptjs';
import { ISolicitanteService } from '../interfaces/solicitante.service';
import { Solicitante } from '../entity/solicitante';
import { Imagen } from '../entity/imagen';


@injectable()
class SolicitanteService implements ISolicitanteService  {


    async buscarPorCredencial(id: number) {
        const solicitante = await  getRepository(Solicitante) 
        .createQueryBuilder("solicitante")
        .leftJoinAndSelect("solicitante.imagen", "imagen")
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
    async adicionar(body: any) {
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
                    {email: body.email, 
                     password: bcrypt.hashSync(body.password,10) ,
                     rol: {id: body.id_rol}
                    });
                let imagen = await queryRunner.manager.save(Imagen, 
                    { id_cloudinary: 'no-image2_uyivib',
                      formato: 'png',
                      url: 'http://res.cloudinary.com/dl8ifr7sr/image/upload/v1595442138/no-image2_uyivib.png',
                      url_segura: 'https://res.cloudinary.com/dl8ifr7sr/image/upload/v1595442138/no-image2_uyivib.png'});
                    
                let solicitante_guardado = await queryRunner.manager.save(Solicitante,
                    {
                    nombre:body.nombre, 
                    apellidos: body.apellidos, 
                    imagen: imagen, 
                    telefono: body.telefono, 
                    cedula: body.cedula, 
                    genero: body.genero, 
                    habilitado: false,
                    nacionalidad: body.nacionalidad,
                    direccion:body.direccion,
                    ocupado: false,
                    fecha_nac: body.fecha_nac,
                    estado_civil: {id: body.id_estado_civil},
                    ciudad: {id: body.id_ciudad},
                    profesion: {id: body.id_profesion},
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
    async modificar(solicitante: Solicitante, body: any) {
        const solicitante_modificado = await getRepository(Solicitante)
        .createQueryBuilder()
        .update(Solicitante)
        .set({
            nombre:body.nombre, 
            apellidos: body.apellidos, 
            telefono: body.telefono, 
            cedula: body.cedula, 
            genero: body.genero, 
            habilitado: body.habilitado,
            nacionalidad: body.nacionalidad,
            direccion:body.direccion,
            fecha_nac: body.fecha_nac,
            estado_civil: {id: body.id_estado_civil},
            ciudad: {id: body.id_ciudad},
        })
        .where("id = :id", { id: solicitante.id })
        .execute();
        const credencial = await getRepository(Credenciales)
        .createQueryBuilder()
        .update(Credenciales)
        .set({email: body.email})
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
        const solicitante = await 
        getRepository(Solicitante)
       .createQueryBuilder("solicitantes")
       .leftJoinAndSelect("solicitantes.credenciales", "credenciales")
       .leftJoinAndSelect("solicitantes.imagen", "imagen")
       .leftJoinAndSelect("solicitantes.estado_civil", "estado_civil")
       .leftJoinAndSelect("solicitantes.ciudad", "ciudad")
       .leftJoinAndSelect("solicitantes.profesion", "profesion")
       .where("solicitantes.id = :id", { id: id })
       .getOne();
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
    async habilitar(id: number) {
        const respuesta = await getRepository(Solicitante)
        .createQueryBuilder()
        .update(Solicitante)
        .set({habilitado: true})
        .where("id = :id", { id: id })
        .execute(); 
        return respuesta;
    }
    async modificarImagen(id: number, imagen: Imagen) {
        const solicitante = await getRepository(Solicitante)
        .createQueryBuilder()
        .update(Solicitante)
        .set({imagen: imagen})
        .where("id = :id", { id: id })
        .execute();
        return solicitante;
    }
}
export { SolicitanteService };  