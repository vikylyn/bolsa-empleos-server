import { injectable, inject } from 'inversify';

import { getRepository,getConnection  } from "typeorm";
import { Credenciales } from '../entity/credenciales';

import bcrypt from 'bcryptjs';
import { ISolicitanteService } from '../interfaces/ISolicitante.service';
import { Solicitante } from '../entity/solicitante';
import { Imagen } from '../entity/imagen';
import { OcupacionSolicitante } from '../entity/ocupacion-solicitante';
import { stringify } from 'querystring';


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

    async filtrarAscendente(body: any, desde: number) {
        let fecha = new Date();
        let mes = fecha.getMonth() + 1;
        let fechaActual = `${fecha.getFullYear()}-${mes}-${fecha.getDate()}`;
        let consulta = "ocupacion.id = :ocupacion ";
        if(parseInt(body.id_ciudad) > 0) {
            consulta +="and ciudad.id = :ciudad_id ";
        }
        if(fechaActual != body.fecha) {
            fechaActual += ' 00:00:00';
            consulta += "and solicitantes.creado_en >= :creado_en ";
        }

        consulta += "and solicitantes.habilitado = true";
        console.log(consulta);
        const solicitantes = await 
        getRepository(Solicitante)
       .createQueryBuilder("solicitantes")
       .leftJoinAndSelect("solicitantes.ciudad", "ciudad")
       .leftJoinAndSelect("ciudad.estado", "estado")
       .leftJoinAndSelect("estado.pais", "pais")
       .leftJoinAndSelect("solicitantes.imagen", "imagen")
       .leftJoinAndSelect("solicitantes.ocupaciones", "ocupaciones")
       .leftJoinAndSelect("ocupaciones.ocupacion", "ocupacion")
       .where( consulta, { ocupacion: body.id_ocupacion, ciudad_id: body.id_ciudad, creado_en: body.fecha })
       .addOrderBy("solicitantes.creado_en", "ASC")
       .skip(desde)  
       .take(6)
       .getMany();
       return solicitantes;
    }
    async filtrarDescendente(body: any, desde: number) {
        let fecha = new Date();
        let mes = fecha.getMonth() + 1;
        let fechaActual = `${fecha.getFullYear()}-${mes}-${fecha.getDate()}`;
        let consulta = "ocupacion.id = :ocupacion ";
        if(parseInt(body.id_ciudad) > 0) {
            consulta +="and ciudad.id = :ciudad_id ";
        }
        if(fechaActual != body.fecha) {
            fechaActual += ' 00:00:00';
            consulta += "and solicitantes.creado_en >= :creado_en ";
        }

        consulta += "and solicitantes.habilitado = true";
        console.log(consulta);
        const solicitantes = await 
        getRepository(Solicitante)
       .createQueryBuilder("solicitantes")
       .leftJoinAndSelect("solicitantes.ciudad", "ciudad")
       .leftJoinAndSelect("ciudad.estado", "estado")
       .leftJoinAndSelect("estado.pais", "pais")
       .leftJoinAndSelect("solicitantes.imagen", "imagen")
       .leftJoinAndSelect("solicitantes.ocupaciones", "ocupaciones")
       .leftJoinAndSelect("ocupaciones.ocupacion", "ocupacion")
       .where( consulta, { ocupacion: body.id_ocupacion, ciudad_id: body.id_ciudad, creado_en: body.fecha })
       .addOrderBy("solicitantes.creado_en", "DESC")
       .skip(desde)  
       .take(6)
       .getMany();
       return solicitantes;
    }
    async contarFiltrados(body: any) {
        let fecha = new Date();
        let mes = fecha.getMonth() + 1;
        let fechaActual = `${fecha.getFullYear()}-${mes}-${fecha.getDate()}`;
        let consulta = "ocupacion.id = :ocupacion ";
        if(parseInt(body.id_ciudad) > 0) {
            consulta +="and ciudad.id = :ciudad_id ";
        }
        if(fechaActual != body.fecha) {
            fechaActual += ' 00:00:00';
            consulta += "and solicitantes.creado_en >= :creado_en ";
        }

        consulta += "and solicitantes.habilitado = true";
        console.log(consulta);
        const solicitantes = await 
        getRepository(Solicitante)
       .createQueryBuilder("solicitantes")
       .leftJoinAndSelect("solicitantes.ciudad", "ciudad")
       .leftJoinAndSelect("ciudad.estado", "estado")
       .leftJoinAndSelect("estado.pais", "pais")
       .leftJoinAndSelect("solicitantes.imagen", "imagen")
       .leftJoinAndSelect("solicitantes.ocupaciones", "ocupaciones")
       .leftJoinAndSelect("ocupaciones.ocupacion", "ocupacion")
       .where( consulta, { ocupacion: body.id_ocupacion, ciudad_id: body.id_ciudad, creado_en: body.fecha })
       .addOrderBy("solicitantes.creado_en", "ASC")
       .getCount();
       return solicitantes;
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
                    {
                     email: body.email, 
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
                    num_complemento_ci: body.num_complemento_ci,
                    genero: body.genero, 
                    habilitado: true,
                    nacionalidad: body.nacionalidad,
                    direccion:body.direccion,
                    ocupado: false,
                    fecha_nac: body.fecha_nac,
                    estado_civil: {id: body.id_estado_civil},
                    ciudad: {id: body.id_ciudad},
                    credenciales: credencial})
                const idProfesiones: string = body.id_profesion;
                for (let index = 0; index < idProfesiones.length; index++) {
                    let ocupacion = await queryRunner.manager.save(OcupacionSolicitante,
                        {
                            solicitante: solicitante_guardado,
                            ocupacion: {id: parseInt(idProfesiones[index]) },
                            habilitado: true
                        });
                        console.log(ocupacion)
                }
    
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
            num_complemento_ci: body.num_complemento_ci,
            genero: body.genero, 
            habilitado: body.habilitado,
            nacionalidad: body.nacionalidad,
            direccion:body.direccion,
            fecha_nac: body.fecha_nac,
            modificado_en: new Date(),
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
            habilitado: false})
        .where("id = :id", { id: id })
        .execute(); 
        return respuesta;
    }
    async buscar(id: number) {
        const solicitante = await 
        getRepository(Solicitante)
       .createQueryBuilder("solicitantes")
       .leftJoinAndSelect("solicitantes.credenciales", "credenciales")
       .leftJoinAndSelect("credenciales.rol", "rol")
       .leftJoinAndSelect("solicitantes.imagen", "imagen")
       .leftJoinAndSelect("solicitantes.estado_civil", "estado_civil")
       .leftJoinAndSelect("solicitantes.ciudad", "ciudad")
       .leftJoinAndSelect("ciudad.estado", "estado")
       .leftJoinAndSelect("solicitantes.ocupaciones", "ocupaciones")
       .leftJoinAndSelect("ocupaciones.ocupacion", "ocupacion")
       .leftJoinAndSelect("estado.pais", "pais")
       .where("solicitantes.id = :id", { id: id })
       .getOne();
    
        if(solicitante){
            solicitante.credenciales.password = 'xd' 
        }
        return solicitante;
    } 

 /*   async activar_ocupacion(id: number) {
        const respuesta = await getRepository(Solicitante)
        .createQueryBuilder()
        .update(Solicitante)
        .set({ocupado: true})
        .where("id = :id", { id: id })
        .execute(); 
        return respuesta;
    }
*/
 /*   async desactivar_ocupacion(id: number) {
        const respuesta = await getRepository(Solicitante)
        .createQueryBuilder()
        .update(Solicitante)
        .set({ocupado: false})
        .where("id = :id", { id: id })
        .execute(); 
        return respuesta;
    }
*/
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