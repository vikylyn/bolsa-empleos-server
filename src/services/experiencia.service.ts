import { injectable} from "inversify";

import { getRepository } from "typeorm";
import { IExperienciaService } from '../interfaces/experiencia.service';
import { ExperienciaLaboral } from '../entity/experiencia-laboral';


@injectable()
class ExperienciaService  implements IExperienciaService  {
    async listar(id: number, desde: number) {
        const experiencias = await 
         getRepository(ExperienciaLaboral)
        .createQueryBuilder("experiencias_laborales")
        .leftJoinAndSelect("experiencias_laborales.area_laboral", "area_laboral")
        .leftJoinAndSelect("experiencias_laborales.curriculum", "curriculum")
        .leftJoinAndSelect("experiencias_laborales.pais", "pais")
        .where("experiencias_laborales.curriculum.id = :id", { id: id })
        .skip(desde)  
        .take(5)
        .getMany();
        return experiencias;
    }
    async adicionar(body: any) {
        const experiencia_nuevo = await  getRepository(ExperienciaLaboral)
        .create({
            empresa: body.empresa,
            puesto: body.puesto,
            descripcion: body.descripcion,
            fecha_inicio: body.fecha_inicio,
            fecha_fin: body.fecha_fin,
            estado: body.estado,
            ciudad: body.ciudad,
            area_laboral: {id: body.id_area_laboral},  
            curriculum: {id: body.id_curriculum},
            pais: {id: body.id_pais}
        });
        const respuesta =  getRepository(ExperienciaLaboral).save(experiencia_nuevo);
        return respuesta;
    }
    async modificar(id: number,body: any) {
        const respuesta = await getRepository(ExperienciaLaboral)
        .createQueryBuilder()
        .update(ExperienciaLaboral)
        .set({
            empresa: body.empresa,
            puesto: body.puesto,
            descripcion: body.descripcion,
            fecha_inicio: body.fecha_inicio,
            fecha_fin: body.fecha_fin,
            estado: body.estado,
            ciudad: body.ciudad,
            area_laboral: {id: body.id_area_laboral},  
            pais: {id: body.id_pais}
        })
        .where("id = :id", { id: id })
        .execute();
        return respuesta;
    }
    async eliminar(id: number) {
        const respuesta = await getRepository(ExperienciaLaboral).delete(id);
        return respuesta;
    }
    async buscar(id: number) {
        const experiencia = await 
        getRepository(ExperienciaLaboral)
        .createQueryBuilder("experiencias_laborales")
        .leftJoinAndSelect("experiencias_laborales.area_laboral", "area_laboral")
        .leftJoinAndSelect("experiencias_laborales.curriculum", "curriculum")
        .leftJoinAndSelect("experiencias_laborales.pais", "pais")
        .where("experiencias_laborales.id = :id", { id: id })
       .getOne();
       return experiencia;
    }
   
    async contar(id_curriculum: number) {
        const total = await getRepository(ExperienciaLaboral)
        .createQueryBuilder("experiencias_laborales")
        .leftJoinAndSelect("experiencias_laborales.area_laboral", "area_laboral")
        .leftJoinAndSelect("experiencias_laborales.curriculum", "curriculum")
        .leftJoinAndSelect("experiencias_laborales.pais", "pais")
        .where("experiencias_laborales.curriculum.id = :id", { id: id_curriculum })
        .getCount();
        return total;
    }
}
  
export {ExperienciaService};  