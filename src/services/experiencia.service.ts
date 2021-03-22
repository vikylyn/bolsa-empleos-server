import { injectable} from "inversify";

import { getRepository, getConnection } from 'typeorm';
import { IExperienciaService } from '../interfaces/IExperiencia.service';
import { ExperienciaLaboral } from '../entity/experiencia-laboral';
import { OtraCiudadExperienciaLaboral } from '../entity/OtraCiudadExperienciaLaboral';


@injectable()
class ExperienciaService  implements IExperienciaService  {
    async listar(id: number, desde: number) {
        const experiencias = await 
         getRepository(ExperienciaLaboral)
        .createQueryBuilder("experiencias_laborales")
  //      .leftJoinAndSelect("experiencias_laborales.grupo_ocupacional", "grupo_ocupacional")
        .leftJoinAndSelect("experiencias_laborales.tipo_contrato", "tipo_contrato")
        .leftJoinAndSelect("experiencias_laborales.curriculum", "curriculum")
        .leftJoinAndSelect("experiencias_laborales.ciudad", "ciudad")
        .leftJoinAndSelect("ciudad.estado", "estado")
        .leftJoinAndSelect("estado.pais", "pais")
        .leftJoinAndSelect("experiencias_laborales.otraCiudad", "otraCiudad")
        .where("experiencias_laborales.curriculum.id = :id", { id: id })
        .skip(desde)  
        .take(5)
        .getMany();
        return experiencias;
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
              
                let experiencia = await queryRunner.manager.save(ExperienciaLaboral, 
                    {
                        empresa: body.empresa,
                        puesto: body.puesto,
                        descripcion: body.descripcion,
                        fecha_inicio: body.fecha_inicio,
                        fecha_fin: body.fecha_fin, 
                        ciudad: {id: body.id_ciudad}, 
                        tipo_contrato: {id: body.id_tipo_contrato},
                        curriculum: {id: body.id_curriculum}
                    });
                if(body.id_pais === 2) {
                    await queryRunner.manager.save(OtraCiudadExperienciaLaboral,
                        {
                            ciudad: body.ciudad,
                            estado: body.estado,
                            pais: body.pais,
                            experiencia: experiencia
                    })
                }
  
                respuesta = experiencia;

                await queryRunner.commitTransaction();
                
                
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
    async modificar(experiencia: ExperienciaLaboral ,body: any) {
       

        let respuesta: any;
        const connection = getConnection();
            const queryRunner = connection.createQueryRunner();

            // establish real database connection using our new query runner
            await queryRunner.connect();

            // lets now open a new transaction:
            await queryRunner.startTransaction();
            try {
                const experiencia_modificada = await getRepository(ExperienciaLaboral)
                .createQueryBuilder()
                .update(ExperienciaLaboral)
                .set({
                    empresa: body.empresa,
                    puesto: body.puesto,
                    descripcion: body.descripcion,
                    fecha_inicio: body.fecha_inicio,
                    fecha_fin: body.fecha_fin,
                    ciudad: {id: body.id_ciudad}, 
                    tipo_contrato: {id: body.id_tipo_contrato}
                })
                .where("id = :id", { id: experiencia.id })
                .execute();

                await getRepository(OtraCiudadExperienciaLaboral)
                    .createQueryBuilder("ciudad")
                    .leftJoinAndSelect("ciudad.experiencia", "experiencia")
                    .delete()
                    .where("experiencia.id = :id", { id: experiencia.id})
                    .execute();

                if(body.id_pais === 2) {
                    await queryRunner.manager.save(OtraCiudadExperienciaLaboral,
                        {
                            ciudad: body.ciudad,
                            estado: body.estado,
                            pais: body.pais,
                            experiencia: {id: experiencia.id}
                    })
                }
  
               
    
                await queryRunner.commitTransaction();

                respuesta = true;
            
            
            } catch (err) {
                console.log(err);
                // since we have errors let's rollback changes we made
                await queryRunner.rollbackTransaction();
                respuesta = err;
            
            } finally {
            
                // you need to release query runner which is manually created:
                await queryRunner.release();
            }

        return respuesta;
    }
    async eliminar(id: number) {
        let respuesta: any;
            const connection = getConnection();
                const queryRunner = connection.createQueryRunner();

                // establish real database connection using our new query runner
                await queryRunner.connect();

                // lets now open a new transaction:
                await queryRunner.startTransaction();
                try {

                    await getRepository(OtraCiudadExperienciaLaboral)
                        .createQueryBuilder("ciudad")
                        .leftJoinAndSelect("ciudad.experiencia", "experiencia")
                        .delete()
                        .where("experiencia.id = :id", { id: id})
                        .execute();

                    await getRepository(ExperienciaLaboral)
                    .createQueryBuilder("experiencia")      
                    .delete()
                    .where("id = :id", { id: id})
                    .execute();
  
                    await queryRunner.commitTransaction();

                    respuesta = true;
                
                
                } catch (err) {
                    console.log(err);
                    // since we have errors let's rollback changes we made
                    await queryRunner.rollbackTransaction();
                    respuesta = err;
                
                } finally {
                
                    // you need to release query runner which is manually created:
                    await queryRunner.release();
                }

            return respuesta;
    }
    async buscar(id: number) {
        const experiencia = await 
        getRepository(ExperienciaLaboral)
        .createQueryBuilder("experiencias_laborales")
        .leftJoinAndSelect("experiencias_laborales.tipo_contrato", "tipo_contrato")
        .leftJoinAndSelect("experiencias_laborales.curriculum", "curriculum")
        .leftJoinAndSelect("experiencias_laborales.ciudad", "ciudad")
        .leftJoinAndSelect("ciudad.estado", "estado")
        .leftJoinAndSelect("estado.pais", "pais")
        .leftJoinAndSelect("experiencias_laborales.otraCiudad", "otraCiudad")
        .where("experiencias_laborales.id = :id", { id: id })
       .getOne();
       return experiencia;
    }
   
    async contar(id_curriculum: number) {
        const total = await getRepository(ExperienciaLaboral)
        .createQueryBuilder("experiencias_laborales")
        .leftJoinAndSelect("experiencias_laborales.tipo_contrato", "tipo_contrato")
        .leftJoinAndSelect("experiencias_laborales.curriculum", "curriculum")
        .where("experiencias_laborales.curriculum.id = :id", { id: id_curriculum })
        .getCount();
        return total;
    }
}
  
export {ExperienciaService};  