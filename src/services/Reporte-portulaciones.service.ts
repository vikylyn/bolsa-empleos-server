import { injectable} from "inversify";
import { getRepository} from 'typeorm';
import { Solicitante } from '../entity/solicitante';
import { IReportePostulacionesService } from '../interfaces/IReporte-postulaciones.service';
import { Postulacion } from '../entity/postulacion';

@injectable()
class ReportePostulacionesService  implements IReportePostulacionesService  {
     // filtrado por el id de Ocupacion de la ocupacion solicitada en la vacante
     async generarListadoPostulacionesRechazadasPorOcupacion(body: any) {
       let habilitado: boolean = false;
       let f1: Date = new Date(body.fecha_inicio);
       let f2: Date = new Date(body.fecha_fin);
     
       if(body.habilitado === true || body.habilitado === 'true') {
            habilitado = true;
       }       
       let consulta = ""

       if(body.habilitado != 'cualquiera'){
            consulta +="and solicitantes.habilitado = :habilitado ";
       }
       if(body.id_ciudad > 0) {
            consulta += "and ciudad.id = :id_ciudad ";
       }
       consulta += "and p.vacantes_id = v.id and v.requisitos_id = r.id and  o.id = r.ocupaciones_id and o.id = :id_ocupacion "
       const postulaciones = await 
       getRepository(Solicitante)
       .createQueryBuilder("solicitantes")
       .leftJoinAndSelect("solicitantes.estado_civil", "estado_civil")
       .leftJoinAndSelect("solicitantes.ciudad", "ciudad")
       .leftJoinAndSelect("ciudad.estado", "estado")
       .leftJoinAndSelect("estado.pais", "pais")
       .leftJoinAndSelect("solicitantes.ocupaciones", "ocupaciones")
      .where( "(select count(*) from postulaciones  as p, vacantes as v, requisitos as r, ocupaciones as o where  solicitantes.id = p.solicitantes_id and (p.rechazado_en between :fecha_inicio and :fecha_fin) and (p.rechazado = true and p.aceptado = false) "+consulta+" group by p.solicitantes_id) in (:num_rechazos) ", 
         {fecha_inicio: f1, 
          fecha_fin: f2,  
          habilitado: habilitado, 
          id_ocupacion: body.id_ocupacion, 
          id_ciudad: body.id_ciudad,
          num_rechazos: body.num_rechazos
         })
      .addOrderBy("solicitantes.creado_en", "ASC")
      .getMany();
      return postulaciones;
    }
 /*    async generarListadoPostulacionesRechazadasPorOcupacion(body: any) {
     let habilitado: boolean = false;
     if(body.habilitado === true || body.habilitado === 'true') {
          habilitado = true;
     }       
     let consulta = "(postulaciones.creado_en between :fecha_inicio and :fecha_fin) "
     if(body.habilitado != 'cualquiera'){
          consulta +="and solicitante.habilitado = :habilitado ";
     }
     if(body.id_ciudad > 0) {
          consulta += "and ciudad.id = :id_ciudad ";
     }
     consulta += "and ocupacion.id = :id_ocupacion "
     consulta += "and postulaciones.rechazado = true and postulaciones.aceptado = false"

      const postulaciones = await 
      getRepository(Postulacion)
     .createQueryBuilder("postulaciones")
     .leftJoinAndSelect("postulaciones.solicitante", "solicitante")
     .leftJoinAndSelect("solicitante.estado_civil", "estado_civil")
     .leftJoinAndSelect("solicitante.ciudad", "ciudad")
     .leftJoinAndSelect("ciudad.estado", "estado")
     .leftJoinAndSelect("estado.pais", "pais")
     .leftJoinAndSelect("postulaciones.vacante", "vacante")
     .leftJoinAndSelect("vacante.requisitos", "requisitos")
     .leftJoinAndSelect("requisitos.ocupacion", "ocupacion")
     .where( consulta, {fecha_inicio: body.fecha_inicio, fecha_fin: body.fecha_fin, habilitado: habilitado, id_ocupacion: body.id_ocupacion, id_ciudad: body.id_ciudad })
     .addOrderBy("postulaciones.creado_en", "ASC")
     .getMany();
     return postulaciones;
  }
  */
    async contarPostulacionesRechazadasPorOcupacion(body: any) {
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
  
export {ReportePostulacionesService};  