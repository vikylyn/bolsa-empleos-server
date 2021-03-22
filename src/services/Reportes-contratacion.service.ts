import { injectable} from "inversify";
import { getRepository} from 'typeorm';
import { Contratacion } from '../entity/contratacion';
import { IReportesContratacionService } from '../interfaces/IReportes-contratacion.service';

@injectable()
class ReportesContratacionService  implements IReportesContratacionService  {
     async generarListadoContrataciones(body: any) {
          let habilitado: boolean = false;
          if(body.habilitado === true || body.habilitado === 'true') {
               habilitado = true;
          }       
          let consulta = "(contrataciones.creado_en between :fecha_inicio and :fecha_fin) "
          if(body.habilitado != 'cualquiera'){
               consulta +="and contrataciones.habilitado = :habilitado ";
          }
          if(body.id_ciudad > 0) {
               consulta += "and ciudad.id = :id_ciudad ";
          }
          consulta += "and ocupacion.id = :id_ocupacion"
   
          const contrataciones = await 
          getRepository(Contratacion)
          .createQueryBuilder("contrataciones")
          .leftJoinAndSelect("contrataciones.solicitante", "solicitante")
          .leftJoinAndSelect("contrataciones.vacante", "vacante")
          .leftJoinAndSelect("vacante.tipo_contrato", "tipo_contrato") 
          .leftJoinAndSelect("vacante.horario", "horario") 
          .leftJoinAndSelect("vacante.sueldo", "sueldo")
          .leftJoinAndSelect("vacante.empleador", "empleador")
          .leftJoinAndSelect("vacante.requisitos", "requisitos")
          .leftJoinAndSelect("requisitos.ocupacion", "ocupacion")
          .leftJoinAndSelect("vacante.ciudad", "ciudad")
          .leftJoinAndSelect("ciudad.estado", "estado")
          .leftJoinAndSelect("estado.pais", "pais")
          .where( consulta, {fecha_inicio: body.fecha_inicio, fecha_fin: body.fecha_fin, habilitado: habilitado, id_ocupacion: body.id_ocupacion, id_ciudad: body.id_ciudad })
          .addOrderBy("contrataciones.creado_en", "ASC")
          .getMany();
          return contrataciones;
       }
     async contarContrataciones(body: any) {
          let habilitado: boolean = false;
          if(body.habilitado === true || body.habilitado === 'true') {
               habilitado = true;
          }       
          let consulta = "(contrataciones.creado_en between :fecha_inicio and :fecha_fin) "
          if(body.habilitado != 'cualquiera'){
               consulta +="and contrataciones.habilitado = :habilitado ";
          }
          if(body.id_ciudad > 0) {
               consulta += "and ciudad.id = :id_ciudad ";
          }
          consulta += "and ocupacion.id = :id_ocupacion"
   
          const total = await 
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
          .where( consulta, {fecha_inicio: body.fecha_inicio, fecha_fin: body.fecha_fin, habilitado: habilitado, id_ocupacion: body.id_ocupacion, id_ciudad: body.id_ciudad })
          .getCount();
          return total;
     }
     async generarListadoContratacionesPorNumeroDeContrataciones(body: any) {
          let habilitado: boolean = false;
          if(body.habilitado === true || body.habilitado === 'true') {
               habilitado = true;
          }       
          let consulta:string = "";
          if(body.habilitado != 'cualquiera'){
               consulta +="and solicitante.habilitado = :habilitado ";
          }
          if(body.id_ciudad > 0) {
               consulta += "and ciudad.id = :id_ciudad ";
          }
          consulta += "and ocupacion.id = :id_ocupacion"
              const contrataciones = await getRepository(Contratacion)
                  .createQueryBuilder("contrataciones")
                  .leftJoinAndSelect("contrataciones.solicitante", "solicitante")
                  .leftJoinAndSelect("solicitante.estado_civil", "estado_civil")
                  .leftJoinAndSelect("solicitante.ocupaciones", "ocupaciones")
                  .leftJoinAndSelect("solicitante.ciudad", "ciudad")
                  .leftJoinAndSelect("ciudad.estado", "estado")
                  .leftJoinAndSelect("estado.pais", "pais")
                  .leftJoinAndSelect("contrataciones.vacante", "vacante")
                  .leftJoinAndSelect("vacante.requisitos", "requisitos")
                  .leftJoinAndSelect("requisitos.ocupacion", "ocupacion")
                  .where("(select count(*) from contrataciones  as c where  solicitante.id = c.solicitantes_id and (c.creado_en between :fecha_inicio and :fecha_fin)"+consulta+") in (:num_contrataciones) ",
                       {fecha_inicio: body.fecha_inicio, 
                        fecha_fin: body.fecha_fin, 
                        habilitado: habilitado, 
                        id_ocupacion: body.id_ocupacion, 
                        id_ciudad: body.id_ciudad,
                        num_contrataciones: body.num_contrataciones
                       })
                  .groupBy("solicitante.id")
                  .getMany();
             return contrataciones
       }
       
}
  
export {ReportesContratacionService};  