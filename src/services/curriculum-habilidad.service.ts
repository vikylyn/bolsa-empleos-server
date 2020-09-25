import { injectable} from "inversify";

import { getRepository } from "typeorm";
import { ICurriculumHabilidadService } from '../interfaces/curriculum-habilidad.service';
import { CurriculumHabilidad } from '../entity/curriculum-habilidad';


@injectable()
class CurriculumHabilidadService  implements ICurriculumHabilidadService  {
    async listar(id: number, desde: number) {
        const idiomas = await 
         getRepository(CurriculumHabilidad)
        .createQueryBuilder("curriculums_habilidades")
        .leftJoinAndSelect("curriculums_habilidades.habilidad", "habilidad")
        .leftJoinAndSelect("curriculums_habilidades.curriculum", "curriculum")
        .where("curriculums_habilidades.curriculum.id = :id", { id: id })
        .skip(desde)  
        .take(5)
        .getMany();
        return idiomas;
    }
    async adicionar(body: any) {
        const curriculum_habilidad_nuevo = await  getRepository(CurriculumHabilidad)
        .create({
            curriculum: {id: body.id_curriculum},
            habilidad:{id: body.id_habilidad}
        });
        const respuesta =  getRepository(CurriculumHabilidad).save(curriculum_habilidad_nuevo);
        return respuesta;
    }
    async modificar(id: number, body: any) {
        const respuesta = await getRepository(CurriculumHabilidad)
        .createQueryBuilder()
        .update(CurriculumHabilidad)
        .set({
            habilidad:{id: body.id_habilidad}
        })
        .where("id = :id", { id: id })
        .execute();
        return respuesta;
    }
    async eliminar(id: number) {
        const curriculum_habilidad = await getRepository(CurriculumHabilidad).delete(id);
        return curriculum_habilidad;
    }
    async buscar(id: number) {
        const habilidad = await 
        getRepository(CurriculumHabilidad)
       .createQueryBuilder("curriculums_habilidades")
       .leftJoinAndSelect("curriculums_habilidades.habilidad", "habilidad")
       .leftJoinAndSelect("curriculums_habilidades.curriculum", "curriculum")
       .where("curriculums_habilidades.id = :id", { id: id })
       .getOne();
       return habilidad; 
    }
    async contar(id_curriculum: number) {
        const total = await getRepository(CurriculumHabilidad)
        .createQueryBuilder("curriculums_habilidades")
        .leftJoinAndSelect("curriculums_habilidades.curriculum", "curriculum")
        .where("curriculums_habilidades.curriculum.id = :id", { id: id_curriculum })
        .getCount();
        return total;
    }
   
   
}
  
export {CurriculumHabilidadService};  