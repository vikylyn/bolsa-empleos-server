import { injectable} from "inversify";

import { getRepository } from "typeorm";
import { INotificacionSolicitanteService } from '../interfaces/notificacion-solicitante.service';
import { NotificacionSolicitante } from '../entity/notificacion-solicitante';


@injectable()
class NotificacionSolicitanteService  implements INotificacionSolicitanteService  {

    async listar(id_solicitante: number) {
        const notificaciones: NotificacionSolicitante [] = await getRepository(NotificacionSolicitante)
        .createQueryBuilder("notificaciones_solicitantes")
        .leftJoinAndSelect("notificaciones_solicitantes.solicitante", "solicitante")
        .leftJoinAndSelect("notificaciones_solicitantes.empleador", "empleador")
        .leftJoinAndSelect("notificaciones_solicitantes.vacante", "vacante")
        .leftJoinAndSelect("vacante.requisitos", "requisitos")
        .leftJoinAndSelect("requisitos.ocupacion", "ocupacion")
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

}
  
export { NotificacionSolicitanteService};  