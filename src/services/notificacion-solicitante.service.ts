import { injectable} from "inversify";

import { getRepository, getConnection } from 'typeorm';
import { INotificacionSolicitanteService } from '../interfaces/INotificacionSolicitante.service';
import { NotificacionSolicitante } from '../entity/notificacion-solicitante';


@injectable()
class NotificacionSolicitanteService  implements INotificacionSolicitanteService  {

    async listar(id_solicitante: number) {
        const notificaciones: NotificacionSolicitante [] = await getRepository(NotificacionSolicitante)
        .createQueryBuilder("notificaciones_solicitantes")
        .leftJoinAndSelect("notificaciones_solicitantes.solicitante", "solicitante")
        .leftJoinAndSelect("notificaciones_solicitantes.vacante", "vacante")
        .leftJoinAndSelect("vacante.requisitos", "requisitos")
        .leftJoinAndSelect("requisitos.ocupacion", "ocupacion")
        .leftJoinAndSelect("vacante.empleador", "empleador")
        .leftJoinAndSelect("empleador.imagen", "imagen")
        .leftJoinAndSelect("notificaciones_solicitantes.tipo_notificacion", "tipo_notificacion")
        .where("solicitante.id = :id_solicitante", {id_solicitante: id_solicitante})
        .addOrderBy("notificaciones_solicitantes.creado_en", "DESC")
        .getMany();
        return notificaciones;
    }
    async contarNoLeidas(id_solicitante: number) {
        const total: number = await getRepository(NotificacionSolicitante)
        .createQueryBuilder("notificaciones_solicitantes")
        .leftJoinAndSelect("notificaciones_solicitantes.solicitante", "solicitante")
        .where("solicitante.id = :id_solicitante and notificaciones_solicitantes.leido = false", {id_solicitante: id_solicitante})
        .getCount();
        return total;
    }

    async leerNotificacion(id_notificacion: number) {
        const notificacion = await getRepository(NotificacionSolicitante)
        .createQueryBuilder()
        .update(NotificacionSolicitante)
        .set({
            leido: true
        })
        .where("id = :id", { id: id_notificacion })
        .execute();
        return notificacion;
    }
    async buscar(id_notificacion: number) {
        let notificacion: NotificacionSolicitante;
        notificacion = await  getRepository(NotificacionSolicitante).findOne(id_notificacion);
        if(notificacion){
          notificacion.solicitante.credenciales.password = "xd";
      //    notificacion.empleador.credenciales.password = "xd";
        }
     /*   const notificacion: NotificacionSolicitante = await getRepository(NotificacionSolicitante)
        .createQueryBuilder("notificaciones_solicitantes")
        .leftJoinAndSelect("notificaciones_solicitantes.solicitante", "solicitante")
        .leftJoinAndSelect("notificaciones_solicitantes.empleador", "empleador")
        .leftJoinAndSelect("notificaciones_solicitantes.vacante", "vacante")
        .leftJoinAndSelect("vacante.requisitos", "requisitos")
        .leftJoinAndSelect("requisitos.ocupacion", "ocupacion")
        .leftJoinAndSelect("notificaciones_solicitantes.tipo_notificacion", "tipo_notificacion")
        .where("notificaciones_solicitantes.id = :id", {id: id_notificacion})
        .getOne();
    */
        return notificacion;
    }

    async buscarPorIdSolicitanteVacanteTipoNotificacion(id_solicitante: number, id_vacante: number, id_tipo_notificacion: number) {
        const notificacion: NotificacionSolicitante = await getRepository(NotificacionSolicitante)
        .createQueryBuilder("notificaciones_solicitantes")
        .leftJoinAndSelect("notificaciones_solicitantes.solicitante", "solicitante")
        .leftJoinAndSelect("notificaciones_solicitantes.vacante", "vacante")
        .leftJoinAndSelect("notificaciones_solicitantes.tipo_notificacion", "tipo_notificacion")
        .where("solicitante.id = :id_solicitante and vacante.id = :id_vacante and tipo_notificacion.id = :id_tipo_notificacion", {id_solicitante,id_vacante, id_tipo_notificacion})
        .getOne();

        return notificacion;
    }
    async eliminar(id_notificacion: number) {
        let respuesta: any;
        const connection = getConnection();
            const queryRunner = connection.createQueryRunner();

            // establish real database connection using our new query runner
            await queryRunner.connect();

            // lets now open a new transaction:
            await queryRunner.startTransaction();
            try {
                // execute some operations on this transaction:
                await getRepository(NotificacionSolicitante)
                    .createQueryBuilder()
                    .delete()
                    .where("id = :id", { id: id_notificacion })
                    .execute();
    
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

    async listarConPaginacion(id_solicitante: number, desde: number) {
        const notificaciones = await getRepository(NotificacionSolicitante)
        .createQueryBuilder("notificaciones_solicitantes")
        .leftJoinAndSelect("notificaciones_solicitantes.solicitante", "solicitante")
        .leftJoinAndSelect("notificaciones_solicitantes.vacante", "vacante")
        .leftJoinAndSelect("vacante.requisitos", "requisitos")
        .leftJoinAndSelect("requisitos.ocupacion", "ocupacion")
        .leftJoinAndSelect("vacante.empleador", "empleador")
        .leftJoinAndSelect("empleador.imagen", "imagen")
        .leftJoinAndSelect("notificaciones_solicitantes.tipo_notificacion", "tipo_notificacion")
        .where("solicitante.id = :id_solicitante", {id_solicitante: id_solicitante})
        .addOrderBy("notificaciones_solicitantes.creado_en", "DESC")
        .skip(desde)  
        .take(5)
        .getMany();
        return notificaciones;
    }

    async contarTodas(id_solicitante: number) {
        const notificaciones: number= await getRepository(NotificacionSolicitante)
        .createQueryBuilder("notificaciones_solicitantes")
        .leftJoinAndSelect("notificaciones_solicitantes.solicitante", "solicitante")
        .leftJoinAndSelect("notificaciones_solicitantes.vacante", "vacante")
        .leftJoinAndSelect("vacante.requisitos", "requisitos")
        .leftJoinAndSelect("requisitos.ocupacion", "ocupacion")
        .leftJoinAndSelect("vacante.empleador", "empleador")
        .leftJoinAndSelect("empleador.imagen", "imagen")
        .leftJoinAndSelect("notificaciones_solicitantes.tipo_notificacion", "tipo_notificacion")
        .where("solicitante.id = :id_solicitante", {id_solicitante: id_solicitante})
        .getCount();
        return notificaciones;
    }
}
  
export { NotificacionSolicitanteService};  