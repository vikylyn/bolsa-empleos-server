import { injectable} from "inversify";

import { getRepository, getConnection } from 'typeorm';
import { IVacanteService } from '../interfaces/vacante.service';
import { Requisitos } from '../entity/requisitos';

import {Vacante} from '../entity/vacante'

@injectable()
class VacanteService  implements IVacanteService  {
    async filtrarVacantes(body: any, desde: number) {
        let fecha = new Date();
        let mes = fecha.getMonth() + 1;
        let fechaActual = `${fecha.getFullYear()}-${mes}-${fecha.getDate()}`;
        let consulta = "requisitos.ocupacion.id = :ocupacion ";
        if(parseInt(body.id_ciudad) > 0) {
            consulta +="and ciudad.id = :ciudad_id ";
        }
        if(parseInt(body.id_tipo_contrato) > 0) {
            consulta +="and tipo_contrato.id = :tipo_contrato_id ";
        }
        if(fechaActual === body.fecha) {
            consulta += "and vacantes.creado_en <= :creado_en ";
 
        }else {
            consulta += "and vacantes.creado_en >= :creado_en ";
        }

        consulta += "and vacantes.habilitado = true and vacantes.eliminado = false";

        const vacantes = await 
        getRepository(Vacante)
       .createQueryBuilder("vacantes")
       .leftJoinAndSelect("vacantes.sueldo", "sueldo")
       .leftJoinAndSelect("vacantes.horario", "horario")
       .leftJoinAndSelect("vacantes.requisitos", "requisitos")
       .leftJoinAndSelect("requisitos.ocupacion", "requisitos.ocupacion")
       .leftJoinAndSelect("requisitos.idioma", "requisitos.idioma")
       .leftJoinAndSelect("vacantes.tipo_contrato", "tipo_contrato")
       .leftJoinAndSelect("vacantes.ciudad", "ciudad")
       .leftJoinAndSelect("ciudad.estado", "estado")
       .leftJoinAndSelect("estado.pais", "pais")
       .leftJoinAndSelect("vacantes.empleador", "empleador")
       .leftJoinAndSelect("empleador.imagen", "imagen")
       .where( consulta, { ocupacion: body.id_ocupacion, ciudad_id: body.id_ciudad, tipo_contrato_id: body.id_tipo_contrato, creado_en: body.fecha })
       .addOrderBy("vacantes.creado_en", "DESC")
       .skip(desde)  
       .take(5)
       .getMany();
       return vacantes;
    }
    async listarTodas(id: number, desde: number) { 
        const vacantes = await 
         getRepository(Vacante)
        .createQueryBuilder("vacantes")
        .leftJoinAndSelect("vacantes.sueldo", "sueldo")
        .leftJoinAndSelect("vacantes.horario", "horario")
        .leftJoinAndSelect("vacantes.requisitos", "requisitos")
        .leftJoinAndSelect("requisitos.ocupacion", "ocupacion")
        .leftJoinAndSelect("requisitos.idioma", "idioma")
        .leftJoinAndSelect("vacantes.tipo_contrato", "tipo_contrato")
        .leftJoinAndSelect("vacantes.ciudad", "ciudad")
        .leftJoinAndSelect("vacantes.empleador", "empleador")
        .where("vacantes.empleador.id = :id and vacantes.eliminado = false", { id: id })
        .addOrderBy("vacantes.creado_en", "DESC")
        .skip(desde)  
        .take(5)
        .getMany();
        return vacantes;
    }
    async listarHabilitadas(id: number, desde: number) { 
        const vacantes = await 
         getRepository(Vacante)
        .createQueryBuilder("vacantes")
        .leftJoinAndSelect("vacantes.sueldo", "sueldo")
        .leftJoinAndSelect("vacantes.horario", "horario")
        .leftJoinAndSelect("vacantes.requisitos", "requisitos")
        .leftJoinAndSelect("requisitos.ocupacion", "ocupacion")
        .leftJoinAndSelect("requisitos.idioma", "idioma")
        .leftJoinAndSelect("vacantes.tipo_contrato", "tipo_contrato")
        .leftJoinAndSelect("vacantes.ciudad", "ciudad")
        .leftJoinAndSelect("vacantes.empleador", "empleador")
        .where("vacantes.empleador.id = :id and vacantes.habilitado = true and vacantes.eliminado = false", { id: id })
        .addOrderBy("vacantes.creado_en", "DESC")
        .skip(desde)  
        .take(5)
        .getMany();
        return vacantes;
    }
    async listarInhabilitadas(id: number, desde: number) { 
        const vacantes = await 
         getRepository(Vacante)
        .createQueryBuilder("vacantes")
        .leftJoinAndSelect("vacantes.sueldo", "sueldo")
        .leftJoinAndSelect("vacantes.horario", "horario")
        .leftJoinAndSelect("vacantes.requisitos", "requisitos")
        .leftJoinAndSelect("requisitos.ocupacion", "ocupacion")
        .leftJoinAndSelect("requisitos.idioma", "idioma")
        .leftJoinAndSelect("vacantes.tipo_contrato", "tipo_contrato")
        .leftJoinAndSelect("vacantes.ciudad", "ciudad")
        .leftJoinAndSelect("vacantes.empleador", "empleador")
        .where("vacantes.empleador.id = :id and vacantes.habilitado = false and vacantes.eliminado = false", { id: id })
        .addOrderBy("vacantes.creado_en", "DESC")
        .skip(desde)  
        .take(5)
        .getMany();
        return vacantes;
    }
    async contarTodas(id_empleador: number) {
        const total = await 
         getRepository(Vacante)
        .createQueryBuilder("vacantes")
        .leftJoinAndSelect("vacantes.empleador", "empleador")
        .where("vacantes.empleador.id = :id and vacantes.eliminado = false", { id: id_empleador })
        .getCount()
        return total;
    }
    async contarHabilitadas(id_empleador: number) {
        const total = await 
         getRepository(Vacante)
        .createQueryBuilder("vacantes")
        .leftJoinAndSelect("vacantes.empleador", "empleador")
        .where("vacantes.empleador.id = :id and vacantes.habilitado = true and vacantes.eliminado = false", { id: id_empleador })
        .getCount()
        return total;
    }
    async contarInhabilitadas(id_empleador: number) {
        const total = await 
         getRepository(Vacante)
        .createQueryBuilder("vacantes")
        .leftJoinAndSelect("vacantes.empleador", "empleador")
        .where("vacantes.empleador.id = :id and vacantes.habilitado = false and vacantes.eliminado = false", { id: id_empleador })
        .getCount()
        return total;
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
                let requisitos= await queryRunner.manager.save(Requisitos, 
                    {
                        experiencia: body.experiencia,
                        genero: body.genero,
                        ocupacion: {id: body.id_ocupacion},
                        idioma: {id: body.id_idioma}
                    });
                let vacante_nueva = await queryRunner.manager.save(Vacante,
                    {    
                        titulo: body.titulo,
                        sueldo: {id: body.id_sueldo},
                        direccion: body.direccion,
                        horario: {id: body.id_horario},
                        num_vacantes: body.num_vacantes,
                        num_disponibles: body.num_vacantes,
                        num_postulantes_aceptados: 0,
                     //   funciones: body.funciones,
                        descripcion: body.descripcion,
                        habilitado: body.habilitado,
                        requisitos: requisitos,
                        tipo_contrato: {id: body.id_tipo_contrato},
                        ciudad: {id: body.id_ciudad},
                        empleador: {id: body.id_empleador}
                    });
                await queryRunner.commitTransaction();

                respuesta = vacante_nueva;
                
            
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
    async modificar(id: number, body: any) {
        console.log(body.habilitado);
        let habilitado = false;
        if(body.habilitado === true || body.habilitado === 'true') {
            habilitado = true;
        }
        const respuesta = await getRepository(Vacante)
        .createQueryBuilder()
        .update(Vacante)
        .set({
            titulo: body.titulo,
            sueldo: {id: body.id_sueldo},
            direccion: body.direccion,
            horario: {id: body.id_horario},
            num_vacantes: body.num_vacantes,
            num_disponibles: body.num_disponibles,
            descripcion: body.descripcion,
            habilitado: habilitado,
            tipo_contrato: {id: body.id_tipo_contrato},
            ciudad: {id: body.id_ciudad},
        })
        .where("id = :id", { id: id })
        .execute();
        const requisitos = await getRepository(Requisitos)
        .createQueryBuilder()
        .update(Requisitos)
        .set({
            experiencia: body.experiencia,
            genero: body.genero,
            ocupacion: {id: body.id_ocupacion},
            idioma: {id: body.id_idioma}
        })
        .where("id = :id", { id: body.id_requisitos})
        .execute();
        return respuesta;
    }
    async inhabilitar(id: number) {
        const respuesta = await getRepository(Vacante)
        .createQueryBuilder()
        .update(Vacante)
        .set({
            habilitado: false,
        })
        .where("id = :id", { id: id })
        .execute();
        return respuesta;
    }
    async eliminarLogico(id: number) {
        const respuesta = await getRepository(Vacante)
        .createQueryBuilder()
        .update(Vacante)
        .set({
            eliminado: true,
            habilitado: false
        })
        .where("id = :id", { id: id })
        .execute();
        return respuesta;
    }
    async eliminarFisico(id: number) {
        const respuesta = await getRepository(Vacante)
        .createQueryBuilder()
        .delete()
        .where("id = :id", { id: id })
        .execute();
        return respuesta;
    }
    async habilitar(id: number) {
        const respuesta = await getRepository(Vacante)
        .createQueryBuilder()
        .update(Vacante)
        .set({
            habilitado: true,
        })
        .where("id = :id", { id: id })
        .execute();
        return respuesta;
    }
    async buscar(id: number) {
        const vacante = await 
        getRepository(Vacante)
        .createQueryBuilder("vacantes")
        .leftJoinAndSelect("vacantes.sueldo", "sueldo")
        .leftJoinAndSelect("vacantes.horario", "horario")
        .leftJoinAndSelect("vacantes.requisitos", "requisitos")
        .leftJoinAndSelect("requisitos.ocupacion", "ocupacion")
        .leftJoinAndSelect("requisitos.idioma", "idioma")
        .leftJoinAndSelect("vacantes.tipo_contrato", "tipo_contrato")
        .leftJoinAndSelect("vacantes.ciudad", "ciudad")
        .leftJoinAndSelect("ciudad.estado", "estado")
        .leftJoinAndSelect("estado.pais", "pais")
        .leftJoinAndSelect("vacantes.empleador", "empleador")
        .where("vacantes.id = :id", { id: id })
       .getOne();
       return vacante;
    }
   
    async busqueda(valor: string, id_empleador: number) {
        const vacantes = await 
         getRepository(Vacante)
        .createQueryBuilder("vacantes")
        .leftJoinAndSelect("vacantes.sueldo", "sueldo")
        .leftJoinAndSelect("vacantes.horario", "horario")
        .leftJoinAndSelect("vacantes.requisitos", "requisitos")
        .leftJoinAndSelect("requisitos.ocupacion", "ocupacion")
        .leftJoinAndSelect("requisitos.idioma", "idioma")
        .leftJoinAndSelect("vacantes.tipo_contrato", "tipo_contrato")
        .leftJoinAndSelect("vacantes.ciudad", "ciudad")
        .leftJoinAndSelect("vacantes.empleador", "empleador")
        .where("(vacantes.titulo regexp :valor and vacantes.empleador.id = :id) || (ocupacion.nombre regexp :valor and vacantes.empleador.id = :id)",{valor: valor, id: id_empleador})
        .addOrderBy("vacantes.creado_en", "DESC")
        .getMany()
        return vacantes;
     }
}
  
export {VacanteService};  