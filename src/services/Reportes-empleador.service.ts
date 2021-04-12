import { injectable} from "inversify";
import { getRepository} from 'typeorm';
import { Empleador } from '../entity/empleador';
import { IReportesEmpleadorService } from '../interfaces/IReportes-empleador.service';
import { Empresa } from '../entity/empresa';

@injectable()
class ReportesEmpleadorService  implements IReportesEmpleadorService  {

    async generarListadoEmpleadores(body: any) {
        let habilitado: boolean = false;
        let empresa: boolean = false;
        if(body.habilitado === true || body.habilitado === 'true') {
             habilitado = true;
        }       
        let consulta = "(empleadores.creado_en between :fecha_inicio and :fecha_fin) "
        if(body.habilitado != 'cualquiera'){
             consulta +="and empleadores.habilitado = :habilitado ";
        }
        if(body.id_ciudad > 0) {
             consulta += "and ciudad.id = :id_ciudad ";
        }
        if(body.empresa === true || body.empresa === 'true') {
            empresa = true;
        }
        if(body.empresa != 'cualquiera'){
            consulta += "and empleadores.existe_empresa = :empresa"
        }
 
         const empleadores = await 
         getRepository(Empleador)
        .createQueryBuilder("empleadores")
        .leftJoinAndSelect("empleadores.ciudad", "ciudad")
        .leftJoinAndSelect("ciudad.estado", "estado")
        .leftJoinAndSelect("estado.pais", "pais")
        .leftJoinAndSelect("empleadores.empresa", "empresa")
        .leftJoinAndSelect("empresa.razon_social", "razon_social")
        .where( consulta, {fecha_inicio: body.fecha_inicio, fecha_fin: body.fecha_fin, habilitado: habilitado, empresa: empresa, id_ciudad: body.id_ciudad })
        .addOrderBy("empleadores.creado_en", "ASC")
        .getMany();
        return empleadores;
     }

     async contarEmpleadores(body: any) {
          let habilitado: boolean = false;
          let empresa: boolean = false;
          if(body.habilitado === true || body.habilitado === 'true') {
               habilitado = true;
          }       
          let consulta = "(empleadores.creado_en between :fecha_inicio and :fecha_fin) "
          if(body.habilitado != 'cualquiera'){
               consulta +="and empleadores.habilitado = :habilitado ";
          }
          if(body.id_ciudad > 0) {
               consulta += "and ciudad.id = :id_ciudad ";
          }
          if(body.empresa === true || body.empresa === 'true') {
              empresa = true;
          }
          if(body.empresa != 'cualquiera'){
               consulta += "and empleadores.existe_empresa = :empresa"
          }
   
           const total = await 
           getRepository(Empleador)
          .createQueryBuilder("empleadores")
          .leftJoinAndSelect("empleadores.ciudad", "ciudad")
          .leftJoinAndSelect("ciudad.estado", "estado")
          .leftJoinAndSelect("estado.pais", "pais")
          .where( consulta, {fecha_inicio: body.fecha_inicio, fecha_fin: body.fecha_fin, habilitado: habilitado, empresa: empresa, id_ciudad: body.id_ciudad })
          .getCount();
          return total;
     }

     async generarListadoEmpresas(body: any) {
          let habilitado: boolean = false;
          let empresa: boolean = false;
          if(body.habilitado === true || body.habilitado === 'true') {
               habilitado = true;
          }       
          let consulta = "(empresas.creado_en between :fecha_inicio and :fecha_fin) "
          if(body.habilitado != 'cualquiera'){
               consulta +="and empleador.habilitado = :habilitado ";
          }
          if(body.id_ciudad > 0) {
               consulta += "and ciudad.id = :id_ciudad ";
          }
          if(body.id_razon_social > 0) {
               consulta += "and razon_social.id = :id_razon_social ";
          }
          if(body.empresa === true || body.empresa === 'true') {
              empresa = true;
          }
   
           const empleadores = await 
           getRepository(Empresa)
          .createQueryBuilder("empresas")
          .leftJoinAndSelect("empresas.empleador", "empleador")
          .leftJoinAndSelect("empresas.razon_social", "razon_social")
          .leftJoinAndSelect("empresas.ciudad", "ciudad")
          .leftJoinAndSelect("ciudad.estado", "estado")
          .leftJoinAndSelect("estado.pais", "pais")
          .where( consulta, {fecha_inicio: body.fecha_inicio, fecha_fin: body.fecha_fin, habilitado: habilitado, id_ciudad: body.id_ciudad, id_razon_social: body.id_razon_social })
          .addOrderBy("empresas.creado_en", "ASC")
          .getMany();
          return empleadores;
       }
       async contarEmpresas(body: any) {
          let habilitado: boolean = false;
          let empresa: boolean = false;
          if(body.habilitado === true || body.habilitado === 'true') {
               habilitado = true;
          }       
          let consulta = "(empresas.creado_en between :fecha_inicio and :fecha_fin) "
          if(body.habilitado != 'cualquiera'){
               consulta +="and empleador.habilitado = :habilitado ";
          }
          if(body.id_ciudad > 0) {
               consulta += "and ciudad.id = :id_ciudad ";
          }
          if(body.empresa === true || body.empresa === 'true') {
              empresa = true;
          }
   
           const empleadores = await 
           getRepository(Empresa)
          .createQueryBuilder("empresas")
          .leftJoinAndSelect("empresas.empleador", "empleador")
          .leftJoinAndSelect("empresas.ciudad", "ciudad")
          .leftJoinAndSelect("ciudad.estado", "estado")
          .leftJoinAndSelect("estado.pais", "pais")
          .where( consulta, {fecha_inicio: body.fecha_inicio, fecha_fin: body.fecha_fin, habilitado: habilitado, id_ciudad: body.id_ciudad })
          .getCount();
          return empleadores;
       }
}
  
export {ReportesEmpleadorService};  