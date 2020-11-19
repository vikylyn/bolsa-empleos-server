import { injectable} from "inversify";

import { getRepository } from "typeorm";
import { INotificacionEmpleadorService } from '../interfaces/notificacion-empleador.service';
import { NotificacionEmpleador } from '../entity/notificacion-empleador';


@injectable()
class NotificacionEmpleadorService  implements INotificacionEmpleadorService  {

    async listar(id_empleador: number) {
        const notificaciones: NotificacionEmpleador [] = await getRepository(NotificacionEmpleador)
        .createQueryBuilder("notificaciones_empleadores")
        .leftJoinAndSelect("notificaciones_empleadores.empleador", "empleador")
        .leftJoinAndSelect("notificaciones_empleadores.solicitante", "solicitante")
        .leftJoinAndSelect("notificaciones_empleadores.vacante", "vacante")
        .leftJoinAndSelect("vacante.requisitos", "requisitos")
        .leftJoinAndSelect("requisitos.ocupacion", "ocupacion")
        .leftJoinAndSelect("notificaciones_empleadores.tipo_notificacion", "tipo_notificacion")
        .where("empleador.id = :id_empleador", {id_empleador: id_empleador})
        .addOrderBy("notificaciones_empleadores.creado_en", "DESC")
        .getMany();
        return notificaciones;
    }
    async contarNoLeidas(id_empleador: number) {
        const total: number = await getRepository(NotificacionEmpleador)
        .createQueryBuilder("notificaciones_empleadores")
        .leftJoinAndSelect("notificaciones_empleadores.empleador", "empleador")
        .where("empleador.id = :id_empleador and notificaciones_empleadores.leido = false", {id_empleador: id_empleador})
        .getCount();  
        return total;
    }

    async leerNotificacion(id_notificacion: number) {
        const notificacion = await getRepository(NotificacionEmpleador)
        .createQueryBuilder()
        .update(NotificacionEmpleador)
        .set({
            leido: true
        })
        .where("id = :id", { id: id_notificacion })
        .execute();
        return notificacion;
    }


}
  
export { NotificacionEmpleadorService};  