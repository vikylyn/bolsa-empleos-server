import { injectable} from "inversify";
import { IContratacionService } from '../interfaces/contratacion.service';
import { Postulacion } from '../entity/postulacion';
import { Contratacion } from '../entity/contratacion';
import { getRepository, getConnection } from 'typeorm';
import { Solicitante } from '../entity/solicitante';
import { Vacante } from '../entity/vacante';
import { NotificacionEmpleador } from '../entity/notificacion-empleador';
import { NotificacionSolicitante } from '../entity/notificacion-solicitante';


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
                await queryRunner.manager
                    .createQueryBuilder()
                    .update(Vacante)
                    .set({
                        num_disponibles: postulacion.vacante.num_disponibles + 1
                    })
                    .where("id = :id", { id: postulacion.vacante.id })
                    .execute();
                await queryRunner.manager.createQueryBuilder()
                .delete().from(Contratacion).where("solicitante.id = :id_solicitante and vacante.id = :id_vacante", 
                    {id_solicitante: postulacion.solicitante.id, id_vacante: postulacion.vacante.id}).execute();
                const postulacion_eliminada = await queryRunner.manager.createQueryBuilder()
                .delete().from(Postulacion).where("id = :id",{id: postulacion.id}).execute();

                await queryRunner.manager.save(NotificacionEmpleador,
                    {
                        leido: false,
                        solicitante: {id: postulacion.solicitante.id},
                        empleador: {id: postulacion.vacante.empleador.id},
                        vacante: {id: postulacion.vacante.id},
                        tipo_notificacion: {id: 6}
                    });
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
    async listarPorIdVacante(id: number, desde: number) {
        const contrataciones = await 
        getRepository(Contratacion)
       .createQueryBuilder("contrataciones")
       .leftJoinAndSelect("contrataciones.solicitante", "solicitante")
       .leftJoinAndSelect("contrataciones.vacante", "vacante")
       .leftJoinAndSelect("vacante.sueldo", "sueldo")
       .leftJoinAndSelect("vacante.requisitos", "requisitos")
       .leftJoinAndSelect("requisitos.ocupacion", "ocupacion")
       .where("vacante.id = :id and contrataciones.habilitado", { id: id })
       .addOrderBy("contrataciones.creado_en", "DESC")
       .skip(desde)  
       .take(5)
       .getMany();
       return contrataciones;    
    }
    async contarPorIdVacante(id: number) {
        const total = await 
        getRepository(Contratacion)
       .createQueryBuilder("contrataciones")
       .leftJoinAndSelect("contrataciones.solicitante", "solicitante")
       .leftJoinAndSelect("contrataciones.vacante", "vacante")
       .where("vacante.id = :id", { id: id })
       .getCount();
       return total;    
    }
    async listarPorIdSolicitante(id: number, desde: number) {
        const contrataciones = await 
        getRepository(Contratacion)
        .createQueryBuilder("contrataciones")
        .leftJoinAndSelect("contrataciones.solicitante", "solicitante")
        .leftJoinAndSelect("contrataciones.vacante", "vacante")
        .leftJoinAndSelect("vacante.sueldo", "sueldo")
        .leftJoinAndSelect("vacante.empleador", "empleador")
        .leftJoinAndSelect("vacante.requisitos", "requisitos")
        .leftJoinAndSelect("requisitos.ocupacion", "ocupacion")
       .where("solicitante.id = :id", { id: id })
       .skip(desde)  
       .take(5)
       .getMany();
    
        return contrataciones;    
    }
    async  contarPorIdSolicitante(id_solicitante: number) {
        const total = await 
        getRepository(Contratacion)
        .createQueryBuilder("contrataciones")
        .leftJoinAndSelect("contrataciones.solicitante", "solicitante")
        .leftJoinAndSelect("contrataciones.vacante", "vacante")
       .where("solicitante.id = :id", { id: id_solicitante })
       .getCount();
    
        return total; 
    }
    async listarPorIdEmpleador(id: number, desde: number) {
        const contrataciones = await 
        getRepository(Contratacion)
        .createQueryBuilder("contrataciones")
        .leftJoinAndSelect("contrataciones.solicitante", "solicitante")
        .leftJoinAndSelect("contrataciones.vacante", "vacante")
        .leftJoinAndSelect("vacante.sueldo", "sueldo")
        .leftJoinAndSelect("vacante.empleador", "empleador")
        .leftJoinAndSelect("vacante.requisitos", "requisitos")
        .leftJoinAndSelect("requisitos.ocupacion", "ocupacion")
       .where("empleador.id = :id and contrataciones.habilitado =true", { id: id })
       .skip(desde)  
       .take(5)
       .getMany();
    
        return contrataciones;    
    }
    async  contarPorIdEmpleador(id_empleador: number) {
        const total = await 
        getRepository(Contratacion)
        .createQueryBuilder("contrataciones")
        .leftJoinAndSelect("contrataciones.vacante", "vacante")
        .leftJoinAndSelect("vacante.empleador", "empleador")
       .where("empleador.id = :id", { id: id_empleador })
       .getCount();
    
        return total; 
    }

    async buscar(id: number) {
        const contratacion = await  
        getRepository(Contratacion)
       .createQueryBuilder("contrataciones")
       .leftJoinAndSelect("contrataciones.solicitante", "solicitante")
       .leftJoinAndSelect("contrataciones.vacante", "vacante")
       .leftJoinAndSelect("vacante.sueldo", "sueldo")
       .leftJoinAndSelect("vacante.empleador", "empleador")
       .leftJoinAndSelect("vacante.requisitos", "requisitos")
       .leftJoinAndSelect("requisitos.ocupacion", "ocupacion")
       .leftJoinAndSelect("vacante.ciudad", "ciudad")
       .leftJoinAndSelect("ciudad.estado", "estado")
       .leftJoinAndSelect("estado.pais", "pais")
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
                
                await queryRunner.manager
                    .createQueryBuilder()
                    .update(Postulacion)
                    .set({
                        aceptado: true
                    })
                    .where("id = :id", { id: postulacion.id })
                    .execute();
                await queryRunner.manager
                    .createQueryBuilder()
                    .update(Vacante)
                    .set({
                        num_disponibles: postulacion.vacante.num_disponibles - 1
                    })
                    .where("id = :id", { id: postulacion.vacante.id })
                    .execute();

                await queryRunner.manager.save(NotificacionSolicitante,
                        {
                            leido: false,
                            solicitante: {id: postulacion.solicitante.id},
                            empleador: {id: postulacion.vacante.empleador.id},
                            vacante: {id: postulacion.vacante.id},
                            tipo_notificacion: {id: 2}
                        });
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
    async desvincularSolicitante(contratacion: Contratacion) {
        let respuesta: any;
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
                // execute some operations on this transaction:
                
            await queryRunner.manager.createQueryBuilder()
            .update(Contratacion)
            .set({
               habilitado: false
            })
            .where("id = :id", { id: contratacion.id })
            .execute();
            await queryRunner.manager.createQueryBuilder()
            .update(Solicitante)
            .set({
               ocupado: false
            })
            .where("id = :id", { id: contratacion.solicitante.id })
            .execute();
            await queryRunner.manager.save(NotificacionSolicitante,
                {
                    leido: false,
                    solicitante: {id: contratacion.solicitante.id},
                    empleador: {id: contratacion.vacante.empleador.id},
                    vacante: {id: contratacion.vacante.id},
                    tipo_notificacion: {id: 4}
                });
            await queryRunner.commitTransaction();
            respuesta = true; 
                
            
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
    async busqueda(valor: string, id_empleador: number) {
        const contrataciones = await 
        getRepository(Contratacion)
       .createQueryBuilder("contrataciones")
       .leftJoinAndSelect("contrataciones.solicitante", "solicitante")
       .leftJoinAndSelect("contrataciones.vacante", "vacante")
       .leftJoinAndSelect("vacante.sueldo", "sueldo")
       .leftJoinAndSelect("vacante.requisitos", "requisitos")
       .leftJoinAndSelect("vacante.empleador", "empleador")
       .leftJoinAndSelect("requisitos.ocupacion", "ocupacion")
        .where(`(solicitante.nombre regexp :valor and empleador.id = :id and contrataciones.habilitado = true) ||
                (solicitante.apellidos regexp :valor and empleador.id = :id and contrataciones.habilitado = true) || 
                (solicitante.cedula regexp :valor and empleador.id = :id and contrataciones.habilitado = true) ||
                (vacante.titulo regexp :valor and empleador.id = :id and contrataciones.habilitado = true) ||
                (ocupacion.nombre regexp :valor and empleador.id = :id and contrataciones.habilitado = true)`,{valor: valor, id: id_empleador})
        .addOrderBy("contrataciones.creado_en", "DESC")
        .getMany()
        return contrataciones;
     }
}
  
export {ContratacionService}; 