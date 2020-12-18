import { injectable} from "inversify";
import { getRepository} from 'typeorm';
import { IReportesSolicitanteService } from '../interfaces/IReportes-solicitante.service';
import { Solicitante } from '../entity/solicitante';

@injectable()
class ReportesSolicitanteService  implements IReportesSolicitanteService  {
    async generarListadoSolicitantes(body: any) {
       let habilitado: boolean = false;
       if(body.habilitado === true || body.habilitado === 'true') {
            habilitado = true;
       }       
       let consulta = "(solicitantes.creado_en between :fecha_inicio and :fecha_fin) "
       if(body.habilitado != 'cualquiera'){
            consulta +="and solicitantes.habilitado = :habilitado ";
       }
       if(body.id_ciudad > 0) {
            consulta += "and ciudad.id = :id_ciudad ";
       }
       consulta += "and ocupaciones.ocupacion.id = :id_ocupacion"

        const solicitantes = await 
        getRepository(Solicitante)
       .createQueryBuilder("solicitantes")
       .leftJoinAndSelect("solicitantes.estado_civil", "estado_civil")
       .leftJoinAndSelect("solicitantes.ciudad", "ciudad")
       .leftJoinAndSelect("ciudad.estado", "estado")
       .leftJoinAndSelect("estado.pais", "pais")
       .leftJoinAndSelect("solicitantes.ocupaciones", "ocupaciones")
       .where( consulta, {fecha_inicio: body.fecha_inicio, fecha_fin: body.fecha_fin, habilitado: habilitado, id_ocupacion: body.id_ocupacion, id_ciudad: body.id_ciudad })
       .addOrderBy("solicitantes.creado_en", "ASC")
       .getMany();
       return solicitantes;
    }
    async contarSolicitantes(body: any) {
     let habilitado: boolean = false;
     if(body.habilitado === true || body.habilitado === 'true') {
          habilitado = true;
     }       
     let consulta = "(solicitantes.creado_en between :fecha_inicio and :fecha_fin) "
     if(body.habilitado != 'cualquiera'){
          consulta +="and solicitantes.habilitado = :habilitado ";
     }
     if(body.id_ciudad > 0) {
          consulta += "and ciudad.id = :id_ciudad ";
     }
     consulta += "and ocupaciones.ocupacion.id = :id_ocupacion"

      const total = await 
      getRepository(Solicitante)
     .createQueryBuilder("solicitantes")
     .leftJoinAndSelect("solicitantes.estado_civil", "estado_civil")
     .leftJoinAndSelect("solicitantes.ciudad", "ciudad")
     .leftJoinAndSelect("ciudad.estado", "estado")
     .leftJoinAndSelect("estado.pais", "pais")
     .leftJoinAndSelect("solicitantes.ocupaciones", "ocupaciones")
     .where( consulta, {fecha_inicio: body.fecha_inicio, fecha_fin: body.fecha_fin, habilitado: habilitado, id_ocupacion: body.id_ocupacion, id_ciudad: body.id_ciudad })
     .getCount();
     return total;
  }
}
  
export {ReportesSolicitanteService};  