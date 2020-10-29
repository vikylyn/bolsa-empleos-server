import { injectable} from "inversify";
import { IPostulacionService } from '../interfaces/postulacion.service';
import { Postulacion } from '../entity/postulacion';
import { getRepository } from 'typeorm';



@injectable()
class PostulacionService  implements IPostulacionService  {
    async listar(id: number, desde: number) {
        const postulaciones = await 
        getRepository(Postulacion)
       .createQueryBuilder("postulaciones")
       .leftJoinAndSelect("postulaciones.solicitante", "solicitante")
       .leftJoinAndSelect("postulaciones.vacante", "vacante")
       .leftJoinAndSelect("vacante.sueldo", "sueldo")
       .leftJoinAndSelect("vacante.empleador", "empleador")
       .leftJoinAndSelect("vacante.requisitos", "requisitos")
       .leftJoinAndSelect("requisitos.ocupacion", "ocupacion")
       .where("vacante.id = :id && postulaciones.aceptado != true", { id: id })
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
        .where("postulaciones.id = :id", { id: id })
        .getOne();
       return postulacion;
    }
    // borrar -- metodo implemetando con contratacion service
  /*  async aceptarSolicitante(id: number) {
        const respuesta = await getRepository(Postulacion)
        .createQueryBuilder()
        .update(Postulacion)
        .set({
            aceptado: true
        })
        .where("id = :id", { id: id })
        .execute();
        return respuesta;
    }
   */ 
    async eliminar(id: number) {
        const respuesta = await getRepository(Postulacion).delete(id);
        return respuesta;
    }
    async postularSolicitante(body: any) {
        const postulacion_nueva = await  getRepository(Postulacion)
        .create({
            solicitante: {id: body.id_solicitante},
            vacante: {id: body.id_vacante},
            aceptado: false,
            favorito: false
        });
        const respuesta =  getRepository(Postulacion).save(postulacion_nueva);
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
}
  
export {PostulacionService};  