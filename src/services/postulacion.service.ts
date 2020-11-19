import { injectable} from "inversify";
import { IPostulacionService } from '../interfaces/postulacion.service';
import { Postulacion } from '../entity/postulacion';
import { getRepository, getConnection } from 'typeorm';
import { NotificacionEmpleador } from '../entity/notificacion-empleador';
import { NotificacionSolicitante } from '../entity/notificacion-solicitante';
import { Vacante } from '../entity/vacante';
import { Contratacion } from '../entity/contratacion';
import { Solicitante } from '../entity/solicitante';



@injectable()
class PostulacionService  implements IPostulacionService  {
    async listarPorIdVacante(id: number, desde: number) {
        const postulaciones = await 
        getRepository(Postulacion)
       .createQueryBuilder("postulaciones")
       .leftJoinAndSelect("postulaciones.solicitante", "solicitante")
       .leftJoinAndSelect("postulaciones.vacante", "vacante")
       .leftJoinAndSelect("vacante.sueldo", "sueldo")
       .leftJoinAndSelect("vacante.empleador", "empleador")
       .leftJoinAndSelect("vacante.requisitos", "requisitos")
       .leftJoinAndSelect("requisitos.ocupacion", "ocupacion")
       .where("vacante.id = :id && postulaciones.rechazado != true", { id: id })  
     //  .where("vacante.id = :id && postulaciones.aceptado != true", { id: id })
       .addOrderBy("postulaciones.creado_en", "ASC")
       .skip(desde)  
       .take(5)
       .getMany();
       return postulaciones;    
    }
    async contarPorIdVacante(id_vacante: number) {
        const total = await 
        getRepository(Postulacion)
             .createQueryBuilder("postulaciones")
             .leftJoinAndSelect("postulaciones.solicitante", "solicitante")
             .leftJoinAndSelect("postulaciones.vacante", "vacante")
             .where("vacante.id = :id", { id: id_vacante })
             .getCount();
       return total;   
}
    async buscar(id: number) {
        const postulacion = await 
        getRepository(Postulacion)
        .createQueryBuilder("postulaciones")
        .leftJoinAndSelect("postulaciones.solicitante", "solicitante")
        .leftJoinAndSelect("postulaciones.vacante", "vacante")
        .leftJoinAndSelect("vacante.empleador", "empleador")
        .where("postulaciones.id = :id", { id: id })
        .getOne();
       return postulacion;
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
                        num_disponibles: postulacion.vacante.num_disponibles - 1,
                        num_postulantes_aceptados: postulacion.vacante.num_postulantes_aceptados + 1
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

                respuesta = true;
                
            
            } catch (err) {
                await queryRunner.rollbackTransaction();
                respuesta = err;
            } finally {
                await queryRunner.release();
            }

            return respuesta;
    }
    async confirmar(postulacion: Postulacion) {
        let respuesta: any;
        const connection = getConnection();
            const queryRunner = connection.createQueryRunner();

            // establish real database connection using our new query runner
            await queryRunner.connect();

            // lets now open a new transaction:
            await queryRunner.startTransaction();
            try {
                // execute some operations on this transaction:
                
                let contratacion = await queryRunner.manager.save(Contratacion,
                    {    
                       habilitado: true,
                       solicitante: postulacion.solicitante,
                       vacante: postulacion.vacante,
                       confirmado: false
                    });
                
                await queryRunner.manager.createQueryBuilder()
                    .update(Solicitante)
                    .set({
                       ocupado: true
                    })
                    .where("id = :id", { id: postulacion.solicitante.id })
                    .execute();
                await queryRunner.manager.delete(Postulacion,postulacion);
                await queryRunner.manager.save(NotificacionEmpleador,
                    {
                        leido: false,
                        solicitante: {id: postulacion.solicitante.id},
                        empleador: {id: postulacion.vacante.empleador.id},
                        vacante: {id: postulacion.vacante.id},
                        tipo_notificacion: {id: 5}
                    });
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
    async eliminar(id: number) {
        const respuesta = await getRepository(Postulacion).delete(id);
        return respuesta;
    }
    // Empleador elimina la postulacion cuando la rechaza
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
                    num_postulantes_aceptados: postulacion.vacante.num_postulantes_aceptados - 1,
                    num_disponibles: postulacion.vacante.num_disponibles + 1
                })
                .where("id = :id", { id: postulacion.vacante.id })
                .execute();
                await queryRunner.manager
                    .createQueryBuilder()
                    .update(Postulacion)
                    .set({
                        rechazado: true,
                        aceptado: false
                    })
                    .where("id = :id", { id: postulacion.id })  
                    .execute();  
                await queryRunner.manager.save(NotificacionSolicitante,
                   {
                       leido: false,
                       solicitante: {id: postulacion.solicitante.id},
                       empleador: {id: postulacion.vacante.empleador.id},
                       vacante: {id: postulacion.vacante.id},
                       tipo_notificacion: {id: 3}
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
    async postularSolicitante(body: any) {
        let respuesta: any;
        const connection = getConnection();
            const queryRunner = connection.createQueryRunner();

            // establish real database connection using our new query runner
            await queryRunner.connect();

            // lets now open a new transaction:
            await queryRunner.startTransaction();
            try {
                
                // execute some operations on this transaction:
                let postulacion= await queryRunner.manager.save(Postulacion, 
                    {
                        solicitante: {id: body.id_solicitante},
                        vacante: {id: body.id_vacante},
                        aceptado: false,
                        rechazado: false,
                        favorito: false
                    });

                await queryRunner.manager.save(NotificacionEmpleador,
                    {
                        leido: false,
                        solicitante: {id: body.id_solicitante},
                        empleador: {id: body.id_empleador},
                        vacante: {id: body.id_vacante},
                        tipo_notificacion: {id: 1}
                    });

                    
        
                await queryRunner.commitTransaction();

                respuesta = postulacion;
            
            
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
    async favorito(id: number) {
        const respuesta = await getRepository(Postulacion)
        .createQueryBuilder()
        .update(Postulacion)
        .set({
            favorito: true
        })
        .where("id = :id", { id: id })
        .execute();
        return respuesta;
    }
    async listarFavoritos(id: number, desde: number) {
        const postulaciones = await 
        getRepository(Postulacion)
       .createQueryBuilder("postulaciones")
       .leftJoinAndSelect("postulaciones.solicitante", "solicitante")
       .leftJoinAndSelect("postulaciones.vacante", "vacante")
       .where("vacante.id = :id and postulaciones.favorito = true", { id: id })
       .skip(desde)  
       .take(5)
       .getMany();
       return postulaciones; 
    }
    async quitarFavorito(id: number) {
        const respuesta = await getRepository(Postulacion)
        .createQueryBuilder()
        .update(Postulacion)
        .set({
            favorito: false
        })
        .where("id = :id", { id: id })
        .execute();
        return respuesta;
    }
   async listarPorSolicitante(id: number,desde: number) {
         const postulaciones = await 
              getRepository(Postulacion)
             .createQueryBuilder("postulaciones")
             .leftJoinAndSelect("postulaciones.solicitante", "solicitante")
             .leftJoinAndSelect("postulaciones.vacante", "vacante")
             .leftJoinAndSelect("vacante.sueldo", "sueldo")
             .leftJoinAndSelect("vacante.empleador", "empleador")
             .leftJoinAndSelect("vacante.requisitos", "requisitos")
             .leftJoinAndSelect("requisitos.ocupacion", "ocupacion")
             .where("solicitante.id = :id", { id: id })
             .skip(desde)  
             .take(5)
             .getMany();
        return postulaciones;
   }
   async contarPorIdSolicitante(id_solicitante: number) {
            const total = await 
            getRepository(Postulacion)
                .createQueryBuilder("postulaciones")
                .leftJoinAndSelect("postulaciones.solicitante", "solicitante")
                .leftJoinAndSelect("postulaciones.vacante", "vacante")
                .where("solicitante.id = :id", { id: id_solicitante })
                .getCount();
            return total;
   }
   async buscarPorSolicitanteVacante(id_solicitante: number, id_vacante: number) {
    const postulacion = await 
    getRepository(Postulacion)
    .createQueryBuilder("postulaciones")
    .leftJoinAndSelect("postulaciones.solicitante", "solicitante")
    .leftJoinAndSelect("postulaciones.vacante", "vacante")
    .where("postulaciones.solicitante.id = :id_solicitante and postulaciones.vacante.id = :id_vacante", { id_solicitante, id_vacante })
    .getOne();
   return postulacion;
    }

    async busqueda(valor: string, id_empleador: number) {
        const postulaciones = await 
        getRepository(Postulacion)
        .createQueryBuilder("postulaciones")
        .leftJoinAndSelect("postulaciones.solicitante", "solicitante")
        .leftJoinAndSelect("postulaciones.vacante", "vacante")
        .leftJoinAndSelect("vacante.sueldo", "sueldo")
        .leftJoinAndSelect("vacante.empleador", "empleador")
        .leftJoinAndSelect("vacante.requisitos", "requisitos")
        .leftJoinAndSelect("requisitos.ocupacion", "ocupacion")
        .where("(solicitante.nombre regexp :valor and empleador.id = :id) ||(solicitante.apellidos regexp :valor and empleador.id = :id) || (ocupacion.nombre regexp :valor and empleador.id = :id)",{valor: valor, id: id_empleador})
        .addOrderBy("postulaciones.creado_en", "DESC")
        .getMany()
        return postulaciones;
     }
}
  
export {PostulacionService};  