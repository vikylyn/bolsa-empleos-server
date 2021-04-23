import { injectable} from "inversify";
import { createQueryBuilder, getRepository} from 'typeorm';
import { IReportesSolicitanteService } from '../interfaces/IReportes-solicitante.service';
import { Solicitante } from '../entity/solicitante';
import { Contratacion } from '../entity/contratacion';

@injectable()
class ReportesSolicitanteService  implements IReportesSolicitanteService  {
    
    async generarListadoSolicitantes(body: any) { 
       let habilitado: boolean = false;
       let f1: Date = new Date(body.fecha_inicio);
       let f2: Date = new Date(body.fecha_fin);
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
       .where( consulta, {fecha_inicio: f1, fecha_fin: f2, habilitado: habilitado, id_ocupacion: body.id_ocupacion, id_ciudad: body.id_ciudad })
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
  async generarListadoSolicitantesRechazados(body: any) {
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
  async generarListadoSolicitantesContratados(body: any) {
     let habilitado: boolean = false;
     let f1: Date = new Date(body.fecha_inicio);
     let f2: Date = new Date(body.fecha_fin);
     if(body.habilitado === true || body.habilitado === 'true') {
          habilitado = true;
     }       
     let consulta:string = "";
     if(body.habilitado != 'cualquiera'){
          consulta +="and solicitantes.habilitado = :habilitado ";
     }
     if(body.id_ciudad > 0) {
          consulta += "and ciudad.id = :id_ciudad ";
     }
     consulta += "and c.vacantes_id = v.id and v.requisitos_id = r.id and  o.id = r.ocupaciones_id and o.id = :id_ocupacion"
         const solicitantes = await getRepository(Solicitante)
         .createQueryBuilder("solicitantes")
         .leftJoinAndSelect("solicitantes.estado_civil", "estado_civil")
         .leftJoinAndSelect("solicitantes.ciudad", "ciudad")
         .leftJoinAndSelect("ciudad.estado", "estado")
         .leftJoinAndSelect("estado.pais", "pais")
         .leftJoinAndSelect("solicitantes.ocupaciones", "ocupaciones")
         .where("(select count(*) from contrataciones  as c, vacantes as v, requisitos as r, ocupaciones as o where  solicitantes.id = c.solicitantes_id and (c.creado_en between :fecha_inicio and :fecha_fin)"+consulta+" group by c.solicitantes_id) in (:num_contrataciones) ",
                  {fecha_inicio: f1, 
                   fecha_fin: f2,  
                   habilitado: habilitado, 
                   id_ocupacion: body.id_ocupacion, 
                   id_ciudad: body.id_ciudad,
                   num_contrataciones: body.num_contrataciones
                  })
          .getMany();
        return solicitantes
  }
}
  
export {ReportesSolicitanteService};  