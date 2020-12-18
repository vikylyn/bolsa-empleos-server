import { injectable} from "inversify";
import { getRepository} from 'typeorm';
import { Solicitante } from '../entity/solicitante';
import { Empleador } from '../entity/empleador';
import { Vacante } from '../entity/vacante';
import { Contratacion } from '../entity/contratacion';
import { IReportesVacanteService } from '../interfaces/IReportes-vacante.service';

@injectable()
class ReportesVacanteService  implements IReportesVacanteService  {
     async generarListadoVacantes(body: any) {
        let habilitado: boolean = false;
        if(body.habilitado === true || body.habilitado === 'true') {
             habilitado = true;
        }       
        let consulta = "(vacantes.creado_en between :fecha_inicio and :fecha_fin) "
        if(body.habilitado != 'cualquiera'){
             consulta +="and vacantes.habilitado = :habilitado ";
        }
        if(body.id_ciudad > 0) {
             consulta += "and ciudad.id = :id_ciudad ";
        }
        consulta += "and ocupacion.id = :id_ocupacion"
 
        const vacantes = await 
         getRepository(Vacante)
         .createQueryBuilder("vacantes")
         .leftJoinAndSelect("vacantes.sueldo", "sueldo")
         .leftJoinAndSelect("vacantes.horario", "horario")
         .leftJoinAndSelect("vacantes.requisitos", "requisitos")
         .leftJoinAndSelect("requisitos.ocupacion", "ocupacion")
         .leftJoinAndSelect("requisitos.idiomas", "idiomas")
         .leftJoinAndSelect("vacantes.tipo_contrato", "tipo_contrato")
         .leftJoinAndSelect("vacantes.ciudad", "ciudad")
         .leftJoinAndSelect("ciudad.estado", "estado")
         .leftJoinAndSelect("estado.pais", "pais")
         .leftJoinAndSelect("vacantes.empleador", "empleador")
        .where( consulta, {fecha_inicio: body.fecha_inicio, fecha_fin: body.fecha_fin, habilitado: habilitado, id_ocupacion: body.id_ocupacion, id_ciudad: body.id_ciudad })
        .addOrderBy("vacantes.creado_en", "ASC")
        .getMany();
        return vacantes;
     }
     async contarVacantes(body: any) {
          let habilitado: boolean = false;
          if(body.habilitado === true || body.habilitado === 'true') {
               habilitado = true;
          }       
          let consulta = "(vacantes.creado_en between :fecha_inicio and :fecha_fin) "
          if(body.habilitado != 'cualquiera'){
               consulta +="and vacantes.habilitado = :habilitado ";
          }
          if(body.id_ciudad > 0) {
               consulta += "and ciudad.id = :id_ciudad ";
          }
          consulta += "and ocupacion.id = :id_ocupacion"
   
          const total = await 
           getRepository(Vacante)
           .createQueryBuilder("vacantes")
           .leftJoinAndSelect("vacantes.sueldo", "sueldo")
           .leftJoinAndSelect("vacantes.horario", "horario")
           .leftJoinAndSelect("vacantes.requisitos", "requisitos")
           .leftJoinAndSelect("requisitos.ocupacion", "ocupacion")
           .leftJoinAndSelect("requisitos.idiomas", "idiomas")
           .leftJoinAndSelect("vacantes.tipo_contrato", "tipo_contrato")
           .leftJoinAndSelect("vacantes.ciudad", "ciudad")
           .leftJoinAndSelect("ciudad.estado", "estado")
           .leftJoinAndSelect("estado.pais", "pais")
           .leftJoinAndSelect("vacantes.empleador", "empleador")
          .where( consulta, {fecha_inicio: body.fecha_inicio, fecha_fin: body.fecha_fin, habilitado: habilitado, id_ocupacion: body.id_ocupacion, id_ciudad: body.id_ciudad })
          .getCount();
          return total;
       }
}
  
export {ReportesVacanteService};  