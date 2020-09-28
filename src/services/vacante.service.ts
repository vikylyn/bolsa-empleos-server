import { injectable} from "inversify";

import { getRepository, getConnection } from 'typeorm';
import { IVacanteService } from '../interfaces/vacante.service';
import { Vacante } from '../entity/vacante';
import { Requisitos } from '../entity/requisitos';



@injectable()
class VacanteService  implements IVacanteService  {
    async filtrarVacantes(profesion_id: number, ciudad_id: number, fecha: string, tipo_contrato_id: number, desde: number) {
        console.log(fecha)
        const vacantes = await 
        getRepository(Vacante)
       .createQueryBuilder("vacantes")
       .leftJoinAndSelect("vacantes.sueldo", "sueldo")
       .leftJoinAndSelect("vacantes.horario", "horario")
       .leftJoinAndSelect("vacantes.requisitos", "requisitos")
       .leftJoinAndSelect("requisitos.profesion", "requisitos.profesion")
       .leftJoinAndSelect("requisitos.idioma", "requisitos.idioma")
       .leftJoinAndSelect("vacantes.tipo_contrato", "tipo_contrato")
       .leftJoinAndSelect("vacantes.ciudad", "ciudad")
       .leftJoinAndSelect("vacantes.empleador", "empleador")
       .where(
           "requisitos.profesion.id = :profesion "+
           "and ciudad.id = :ciudad_id "+    
           "and tipo_contrato.id = :tipo_contrato_id "+      
           "and vacantes.creado_en >= :creado_en", { profesion: profesion_id,ciudad_id: ciudad_id,tipo_contrato_id: tipo_contrato_id,creado_en: fecha })
       .skip(desde)  
       .take(5)
       .getMany();
       return vacantes;
    }
    async listar(id: number, desde: number) { 
        const vacantes = await 
         getRepository(Vacante)
        .createQueryBuilder("vacantes")
        .leftJoinAndSelect("vacantes.sueldo", "sueldo")
        .leftJoinAndSelect("vacantes.horario", "horario")
        .leftJoinAndSelect("vacantes.requisitos", "requisitos")
        .leftJoinAndSelect("vacantes.tipo_contrato", "tipo_contrato")
        .leftJoinAndSelect("vacantes.ciudad", "ciudad")
        .leftJoinAndSelect("vacantes.empleador", "empleador")
        .where("vacantes.empleador.id = :id", { id: id })
        .skip(desde)  
        .take(5)
        .getMany();
        return vacantes;
    }
    async contar(id_empleador: number) {
        const total = await 
         getRepository(Vacante)
        .createQueryBuilder("vacantes")
        .leftJoinAndSelect("vacantes.sueldo", "sueldo")
        .leftJoinAndSelect("vacantes.horario", "horario")
        .leftJoinAndSelect("vacantes.requisitos", "requisitos")
        .leftJoinAndSelect("vacantes.tipo_contrato", "tipo_contrato")
        .leftJoinAndSelect("vacantes.ciudad", "ciudad")
        .leftJoinAndSelect("vacantes.empleador", "empleador")
        .where("vacantes.empleador.id = :id", { id: id_empleador })
        .getCount()
        return total;
    }
    async adicionar(vacante: Vacante) {
        
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
                        experiencia: vacante.requisitos.experiencia,
                        genero: vacante.requisitos.genero,
                        profesion: vacante.requisitos.profesion,
                        idioma: vacante.requisitos.idioma
                    });
                let vacante_nueva = await queryRunner.manager.save(Vacante,
                    {    
                        titulo: vacante.titulo,
                        sueldo: vacante.sueldo,
                        direccion: vacante.direccion,
                        horario: vacante.horario,
                        num_vacantes: vacante.num_vacantes,
                        num_disponibles: vacante.num_vacantes,
                     //   funciones: vacante.funciones,
                        descripcion: vacante.descripcion,
                        habilitado: vacante.habilitado,
                        requisitos: requisitos,
                        tipo_contrato: vacante.tipo_contrato,
                        ciudad: vacante.ciudad,
                        empleador: vacante.empleador
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
    async modificar(id: number, vacante: Vacante) {
        const respuesta = await getRepository(Vacante)
        .createQueryBuilder()
        .update(Vacante)
        .set({
            titulo: vacante.titulo,
            sueldo: vacante.sueldo,
            direccion: vacante.direccion,
            horario: vacante.horario,
            num_vacantes: vacante.num_vacantes,
            num_disponibles: vacante.num_vacantes,
        //    funciones: vacante.funciones,
            descripcion: vacante.descripcion,
            habilitado: vacante.habilitado,
            requisitos: vacante.requisitos,
            tipo_contrato: vacante.tipo_contrato,
            ciudad: vacante.ciudad,
        })
        .where("id = :id", { id: id })
        .execute();
        const requisitos = await getRepository(Requisitos)
        .createQueryBuilder()
        .update(Requisitos)
        .set({
            experiencia: vacante.requisitos.experiencia,
            genero: vacante.requisitos.genero,
            profesion: vacante.requisitos.profesion,
            idioma: vacante.requisitos.idioma
        })
        .where("id = :id", { id: vacante.requisitos.id })
        .execute();
        return respuesta;
    }
    async deshabilitar(id: number) {
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
    async buscar(id: number) {
        const vacante = await 
        getRepository(Vacante)
        .createQueryBuilder("vacantes")
        .leftJoinAndSelect("vacantes.sueldo", "sueldo")
        .leftJoinAndSelect("vacantes.horario", "horario")
        .leftJoinAndSelect("vacantes.requisitos", "requisitos")
        .leftJoinAndSelect("requisitos.profesion", "requisitos.profesion")
        .leftJoinAndSelect("requisitos.idioma", "requisitos.idioma")
        .leftJoinAndSelect("vacantes.tipo_contrato", "tipo_contrato")
        .leftJoinAndSelect("vacantes.ciudad", "ciudad")
        .leftJoinAndSelect("vacantes.empleador", "empleador")
        .where("vacantes.id = :id", { id: id })
       .getOne();
       return vacante;
    }
   
   
}
  
export {VacanteService};  