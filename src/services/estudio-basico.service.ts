import { injectable} from "inversify";

import { getRepository, getConnection } from 'typeorm';
import { IEstudioBasicoService } from '../interfaces/IEstudioBasico.service';
import { EstudioBasico } from '../entity/estudio-basico';
import { OtraCiudadEBasico } from '../entity/OtraCiudadEstudioBasico';


@injectable()
class EstudioBasicoService  implements IEstudioBasicoService  {
    async listar(id: number, desde: number) {
        const estudios = await 
         getRepository(EstudioBasico)
        .createQueryBuilder("estudios_basicos")
        .leftJoinAndSelect("estudios_basicos.curriculum", "curriculum")
        .leftJoinAndSelect("estudios_basicos.ciudad", "ciudad")
        .leftJoinAndSelect("ciudad.estado", "estado")
        .leftJoinAndSelect("estado.pais", "pais")
        .leftJoinAndSelect("estudios_basicos.otraCiudad", "otraCiudad")
        .leftJoinAndSelect("estudios_basicos.grado_inicio", "grado_inicio")
        .leftJoinAndSelect("estudios_basicos.grado_fin", "grado_fin")
        .leftJoinAndSelect("grado_inicio.nivel_escolar", "nivel_escolar1")
        .leftJoinAndSelect("grado_fin.nivel_escolar", "nivel_escolar2")
        .where("estudios_basicos.curriculum.id = :id", { id: id })
        .skip(desde)  
        .take(5)
        .getMany();
        return estudios;
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
                let estudio = await queryRunner.manager.save(EstudioBasico, 
                    {
                        colegio: body.colegio,
                        fecha_inicio: body.fecha_inicio,
                        fecha_fin: body.fecha_fin,
                        ciudad: {id: body.id_ciudad}, 
                        curriculum: {id: body.id_curriculum},
                        grado_inicio: {id: body.id_grado_inicio},
                        grado_fin: {id: body.id_grado_fin}
                    });
                if(body.id_pais === 2) {
                    await queryRunner.manager.save(OtraCiudadEBasico,
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
    async modificar(estudio: EstudioBasico, body: any) {
        let respuesta: any;
        const connection = getConnection();
            const queryRunner = connection.createQueryRunner();

            // establish real database connection using our new query runner
            await queryRunner.connect();

            // lets now open a new transaction:
            await queryRunner.startTransaction();
            try {
                const estudio_modifi = await getRepository(EstudioBasico)
                .createQueryBuilder()
                .update(EstudioBasico)
                .set({
                    colegio: body.colegio,
                    fecha_inicio: body.fecha_inicio,
                    fecha_fin: body.fecha_fin,
                    ciudad: {id: body.id_ciudad}, 
                    curriculum: {id: body.id_curriculum},
                    grado_inicio: {id: body.id_grado_inicio},
                    grado_fin: {id: body.id_grado_fin}
                })
                .where("id = :id", { id: estudio.id })
                .execute();
                
                await getRepository(OtraCiudadEBasico)
                    .createQueryBuilder("estudios")
                    .leftJoinAndSelect("estudios.estudio", "estudio")
                    .delete()
                    .where("estudio.id = :id", { id: estudio.id})
                    .execute();

                if(body.id_pais === 2) {
                    await queryRunner.manager.save(OtraCiudadEBasico,
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

                    await getRepository(OtraCiudadEBasico)
                        .createQueryBuilder("estudios")
                        .leftJoinAndSelect("estudios.estudio", "estudio")
                        .delete()
                        .where("estudio.id = :id", { id: id})
                        .execute();

                    await getRepository(EstudioBasico)
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
        getRepository(EstudioBasico)
        .createQueryBuilder("estudios_basicos")
        .leftJoinAndSelect("estudios_basicos.curriculum", "curriculum")
        .leftJoinAndSelect("estudios_basicos.ciudad", "ciudad")
        .leftJoinAndSelect("ciudad.estado", "estado")
        .leftJoinAndSelect("estado.pais", "pais")
        .leftJoinAndSelect("estudios_basicos.otraCiudad", "otraCiudad")
        .leftJoinAndSelect("estudios_basicos.grado_inicio", "grado_inicio")
        .leftJoinAndSelect("estudios_basicos.grado_fin", "grado_fin")
        .where("estudios_basicos.id = :id", { id: id })
       .getOne();
       return estudio;
    }

    async contar(id_curriculum: number) {
        const total = await getRepository(EstudioBasico)
        .createQueryBuilder("estudios_basicos")
        .leftJoinAndSelect("estudios_basicos.curriculum", "curriculum")
        .where("estudios_basicos.curriculum.id = :id", { id: id_curriculum })
        .getCount();
        return total;
    }
   
   
}
  
export {EstudioBasicoService};  