import { injectable} from "inversify";
import { IContratacionService } from '../interfaces/contratacion.service';
import { Postulacion } from '../entity/postulacion';
import { Contratacion } from '../entity/contratacion';
import { getRepository, getConnection } from 'typeorm';
import { Solicitante } from '../entity/solicitante';
import { Vacante } from '../entity/vacante';


@injectable()
class ContratacionService  implements IContratacionService  {

    async rechazar(postulacion: Postulacion) {
        let respuesta: any;
        const connection = getConnection();
            const queryRunner = connection.createQueryRunner();

            // establish real database connection using our new query runner
            await queryRunner.connect();

            // lets now open a new transaction:
            await queryRunner.startTransaction();
            try {
                const vacante_modificada = await queryRunner.manager
                    .createQueryBuilder()
                    .update(Vacante)
                    .set({
                        num_disponibles: postulacion.vacante.num_disponibles + 1
                    })
                    .where("id = :id", { id: postulacion.vacante.id })
                    .execute();
                const contratacion_eliminada = await queryRunner.manager.createQueryBuilder()
                .delete().from(Contratacion).where("solicitante.id = :id_solicitante and vacante.id = :id_vacante", 
                    {id_solicitante: postulacion.solicitante.id, id_vacante: postulacion.vacante.id}).execute();
                const postulacion_eliminada = await queryRunner.manager.createQueryBuilder()
                .delete().from(Postulacion).where("id = :id",{id: postulacion.id}).execute();
                await queryRunner.commitTransaction();

                respuesta = postulacion_eliminada;
                
            
            } catch (err) {
                await queryRunner.rollbackTransaction();
                respuesta = err;
            } finally {
                await queryRunner.release();
            }

            return respuesta;   
    }
    async eliminar(contratacion: Contratacion) {
            
        let respuesta: any;
        const connection = getConnection();
            const queryRunner = connection.createQueryRunner();

            // establish real database connection using our new query runner
            await queryRunner.connect();

            // lets now open a new transaction:
            await queryRunner.startTransaction();
            try {
                const vacante_modificada = await queryRunner.manager
                    .createQueryBuilder()
                    .update(Vacante)
                    .set({
                        num_disponibles: contratacion.vacante.num_disponibles + 1
                    })
                    .where("id = :id", { id: contratacion.vacante.id })
                    .execute();
                const contratacion_eliminada = await queryRunner.manager.delete(Contratacion, contratacion);
                const postulacion_eliminada = await queryRunner.manager.createQueryBuilder()
                .delete().from(Postulacion).where("solicitante.id = :id_solicitante and vacante.id = :id_vacante", 
                    {id_solicitante: contratacion.solicitante.id, id_vacante: contratacion.vacante.id}).execute();;
                await queryRunner.commitTransaction();

                respuesta = contratacion;
                
            
            } catch (err) {
                await queryRunner.rollbackTransaction();
                respuesta = err;
            } finally {
                await queryRunner.release();
            }

            return respuesta;
    }
    async listar(id: number, desde: number) {
        const contrataciones = await 
        getRepository(Contratacion)
       .createQueryBuilder("contrataciones")
       .leftJoinAndSelect("contrataciones.solicitante", "solicitante")
       .leftJoinAndSelect("contrataciones.vacante", "vacante")
       .where("vacante.id = :id", { id: id })
       .skip(desde)  
       .take(5)
       .getMany();
       return contrataciones;    }
    async listarConfirmados(id: number, desde: number) {
        const postulaciones = await 
        getRepository(Contratacion)
        .createQueryBuilder("contrataciones")
        .leftJoinAndSelect("contrataciones.solicitante", "solicitante")
        .leftJoinAndSelect("contrataciones.vacante", "vacante")
       .where("solicitante.id = :id and contrataciones.confirmado = true", { id: id })
       .skip(desde)  
       .take(5)
       .getMany();
  return postulaciones;    }
    async buscar(id: number) {
        const contratacion = await  
        getRepository(Contratacion)
       .createQueryBuilder("contrataciones")
       .leftJoinAndSelect("contrataciones.solicitante", "solicitante")
       .leftJoinAndSelect("contrataciones.vacante", "vacante")
       .where("contrataciones.id = :id", { id: id })
       .getOne();
       return contratacion;    
    }

    async aceptarSolicitante(postulacion: Postulacion) {
        let respuesta: any;
        const connection = getConnection();
            const queryRunner = connection.createQueryRunner();

            // establish real database connection using our new query runner
            await queryRunner.connect();

            // lets now open a new transaction:
            await queryRunner.startTransaction();
            try {
             
                let contratacion = await queryRunner.manager.save(Contratacion,
                    {    
                       habilitado: true,
                       solicitante: postulacion.solicitante,
                       vacante: postulacion.vacante,
                       confirmado: false
                    });
                
                const postulacion_modificada = await queryRunner.manager
                    .createQueryBuilder()
                    .update(Postulacion)
                    .set({
                        aceptado: true
                    })
                    .where("id = :id", { id: postulacion.id })
                    .execute();
                const vacante_modificada = await queryRunner.manager
                    .createQueryBuilder()
                    .update(Vacante)
                    .set({
                        num_disponibles: postulacion.vacante.num_disponibles - 1
                    })
                    .where("id = :id", { id: postulacion.vacante.id })
                    .execute();
                await queryRunner.commitTransaction();

                respuesta = contratacion;
                
            
            } catch (err) {
                await queryRunner.rollbackTransaction();
                respuesta = err;
            } finally {
                await queryRunner.release();
            }

            return respuesta;
    }
    async confirmarContrato(postulacion: Postulacion) {
        let respuesta: any;
        const connection = getConnection();
            const queryRunner = connection.createQueryRunner();

            // establish real database connection using our new query runner
            await queryRunner.connect();

            // lets now open a new transaction:
            await queryRunner.startTransaction();
            try {
                // execute some operations on this transaction:
                
                let contratacion = await queryRunner.manager.createQueryBuilder()
                .update(Contratacion)
                .set({
                   confirmado: true
                })
                .where("solicitante.id = :id and vacante.id = :id_vacante ", { id: postulacion.solicitante.id, id_vacante: postulacion.vacante.id })
                .execute();
                
                let solicitante_modificado = await queryRunner.manager.createQueryBuilder()
                    .update(Solicitante)
                    .set({
                       ocupado: true
                    })
                    .where("id = :id", { id: postulacion.solicitante.id })
                    .execute();
                let postulacion_borrada = await queryRunner.manager.delete(Postulacion,postulacion);
                await queryRunner.commitTransaction();

                respuesta = contratacion;
                
            
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
    async desvincularSolicitante(contratacion: Contratacion) {
        let respuesta: any;
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
                // execute some operations on this transaction:
                
            let contratacion_modificada = await queryRunner.manager.createQueryBuilder()
            .update(Contratacion)
            .set({
               habilitado: false
            })
            .where("id = :id", { id: contratacion.id })
            .execute();
            let solicitante_modificado = await queryRunner.manager.createQueryBuilder()
            .update(Solicitante)
            .set({
               ocupado: false
            })
            .where("id = :id", { id: contratacion.solicitante.id })
            .execute();
            await queryRunner.commitTransaction();
            respuesta = contratacion_modificada;
                
            
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
    async buscarPorSolicitanteVacante(id_solicitante: number, id_vacante: number) {
        const contratacion = await 
        getRepository(Contratacion)
        .createQueryBuilder("contrataciones")
        .leftJoinAndSelect("contrataciones.solicitante", "solicitante")
        .leftJoinAndSelect("contrataciones.vacante", "vacante")
        .where("contrataciones.solicitante.id = :id_solicitante and contrataciones.vacante.id = :id_vacante", { id_solicitante, id_vacante })
        .getOne();
       return contratacion;
    }
   
}
  
export {ContratacionService}; 