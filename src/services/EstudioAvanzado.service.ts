import { injectable} from "inversify";

import { getRepository, getConnection } from 'typeorm';
import { IEstudioAvanzadoService } from '../interfaces/IEstudioAvanzado.service';
import { EstudioAvanzado as any, EstudioAvanzado } from '../entity/estudio-avanzado';
import { OtraCiudadEAvanzado } from '../entity/OtraCiudadEstudioAvanzado';


@injectable()
class EstudioAvanzadoService  implements IEstudioAvanzadoService  {
    async listar(id: number, desde: number) {
        const estudios = await 
         getRepository(any)
        .createQueryBuilder("estudios_avanzados")
        .leftJoinAndSelect("estudios_avanzados.curriculum", "curriculum")
        .leftJoinAndSelect("estudios_avanzados.nivel_estudio", "nivel_estudio")
        .leftJoinAndSelect("estudios_avanzados.ciudad", "ciudad")
        .leftJoinAndSelect("ciudad.estado", "estado")
        .leftJoinAndSelect("estado.pais", "pais")
        .leftJoinAndSelect("estudios_avanzados.otraCiudad", "otraCiudad")
        .where("estudios_avanzados.curriculum.id = :id", { id: id })
        .skip(desde)  
        .take(5)
        .getMany();
        return estudios;
    }
    async adicionar(body: any) {
        const estudio_nuevo = await  getRepository(any)
        .create({
           
        });
   
        let respuesta: any;
        const connection = getConnection();
            const queryRunner = connection.createQueryRunner();

            // establish real database connection using our new query runner
            await queryRunner.connect();

            // lets now open a new transaction:
            await queryRunner.startTransaction();
            try {
                // execute some operations on this transaction:
                let estudio = await queryRunner.manager.save(EstudioAvanzado, 
                    {
                        institucion: body.institucion,
                        carrera: body.carrera,
                        fecha_inicio: body.fecha_inicio,
                        fecha_fin: body.fecha_fin,
                        curriculum: {id: body.id_curriculum},
                        nivel_estudio:{id: body.id_nivel_estudio},
                        ciudad: {id: body.id_ciudad}
                    });
                if(body.id_pais === 2) {
                    await queryRunner.manager.save(OtraCiudadEAvanzado,
                        {
                            ciudad: body.ciudad,
                            estado: body.estado,
                            pais: body.pais,
                            estudio: estudio
                    })
                }
  
               
    
                await queryRunner.commitTransaction();

                respuesta = estudio;
            
            
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
    async modificar(estudio: EstudioAvanzado, body: any) {

        let respuesta: any;
        const connection = getConnection();
            const queryRunner = connection.createQueryRunner();

            // establish real database connection using our new query runner
            await queryRunner.connect();

            // lets now open a new transaction:
            await queryRunner.startTransaction();
            try {
                const estudio_modifi = await getRepository(EstudioAvanzado)
                .createQueryBuilder()
                .update(EstudioAvanzado)
                .set({
                    institucion: body.institucion,
                    carrera: body.carrera,
                    fecha_inicio: body.fecha_inicio,
                    fecha_fin: body.fecha_fin,
                    nivel_estudio:{id: body.id_nivel_estudio},
                    ciudad: {id: body.id_ciudad}
                })
                .where("id = :id", { id: estudio.id })
                .execute();
                
                await getRepository(OtraCiudadEAvanzado)
                    .createQueryBuilder("estudios")
                    .leftJoinAndSelect("estudios.estudio", "estudio")
                    .delete()
                    .where("estudio.id = :id", { id: estudio.id})
                    .execute();

                if(body.id_pais === 2) {
                    await queryRunner.manager.save(OtraCiudadEAvanzado,
                        {
                            ciudad: body.ciudad,
                            estado: body.estado,
                            pais: body.pais,
                            estudio: {id: estudio.id}
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

                await getRepository(OtraCiudadEAvanzado)
                    .createQueryBuilder("estudios")
                    .leftJoinAndSelect("estudios.estudio", "estudio")
                    .delete()
                    .where("estudio.id = :id", { id: id})
                    .execute();

                await getRepository(EstudioAvanzado)
                .createQueryBuilder("estudios")      
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
        const estudio = await 
        getRepository(any)
        .createQueryBuilder("estudios_avanzados")
        .leftJoinAndSelect("estudios_avanzados.curriculum", "curriculum")
        .leftJoinAndSelect("estudios_avanzados.ciudad", "ciudad")
        .leftJoinAndSelect("ciudad.estado", "estado")
        .leftJoinAndSelect("estado.pais", "pais")
        .leftJoinAndSelect("estudios_avanzados.otraCiudad", "otraCiudad")
        .leftJoinAndSelect("estudios_avanzados.nivel_estudio", "nivel_estudio")
        .where("estudios_avanzados.id = :id", { id: id })
       .getOne();
       return estudio;
    }
    async contar(id_curriculum: number) {
        const total = await getRepository(any)
        .createQueryBuilder("estudios_avanzados")
        .leftJoinAndSelect("estudios_avanzados.curriculum", "curriculum")
        .where("estudios_avanzados.curriculum.id = :id", { id: id_curriculum })
        .getCount();
        return total;
    }
   
}
  
export {EstudioAvanzadoService};  