import { injectable} from "inversify";

import { getRepository } from "typeorm";
import { ICurriculumIdiomaService } from '../interfaces/ICurriculum-idioma.service';
import { CurriculumIdioma } from '../entity/curriculum-idioma';
import { Curriculum } from '../entity/curriculum';


@injectable()
class CurriculumIdiomaService  implements ICurriculumIdiomaService  {
    async listar(id: number, desde: number) {
        const idiomas = await 
         getRepository(CurriculumIdioma)
        .createQueryBuilder("curriculums_idiomas")
        .leftJoinAndSelect("curriculums_idiomas.idioma", "idioma")
        .leftJoinAndSelect("curriculums_idiomas.nivel_escrito", "nivel_escrito")
        .leftJoinAndSelect("curriculums_idiomas.nivel_oral", "nivel_oral")
        .leftJoinAndSelect("curriculums_idiomas.nivel_lectura", "nivel_lectura")
        .leftJoinAndSelect("curriculums_idiomas.curriculum", "curriculum")
        .where("curriculums_idiomas.curriculum.id = :id", { id: id })
        .skip(desde)  
        .take(5)
        .getMany();
        return idiomas;
    }

    async adicionar(body: any) {
        const curriculum_idioma_nuevo = await  getRepository(CurriculumIdioma)
        .create({
            curriculum: {id: body.id_curriculum},
            idioma: {id: body.id_idioma},
            nivel_escrito: {id: body.id_nivel_escrito},
            nivel_oral: {id: body.id_nivel_oral},
            nivel_lectura: {id: body.id_nivel_lectura}
        });
        const respuesta =  getRepository(CurriculumIdioma).save(curriculum_idioma_nuevo);
        return respuesta; 
    }
    async modificar(id: number, body: any) {
        const respuesta = await getRepository(CurriculumIdioma)
        .createQueryBuilder()
        .update(CurriculumIdioma)
        .set({
            idioma: {id: body.id_idioma},
            nivel_escrito: {id: body.id_nivel_escrito},
            nivel_oral: {id: body.id_nivel_oral},
            nivel_lectura: {id: body.id_nivel_lectura}
        })
        .where("id = :id", { id: id })
        .execute();
        return respuesta;
    }
    async eliminar(id: number) {
        const curriculum_idioma = await getRepository(CurriculumIdioma).delete(id);
        return curriculum_idioma;
    }
    async buscar(id: number) {

        const idioma = await 
         getRepository(CurriculumIdioma)
        .createQueryBuilder("curriculums_idiomas")
        .leftJoinAndSelect("curriculums_idiomas.idioma", "idioma")
        .leftJoinAndSelect("curriculums_idiomas.nivel_escrito", "nivel_escrito")
        .leftJoinAndSelect("curriculums_idiomas.nivel_oral", "nivel_oral")
        .leftJoinAndSelect("curriculums_idiomas.nivel_lectura", "nivel_lectura")
        .leftJoinAndSelect("curriculums_idiomas.curriculum", "curriculum")
        .where("curriculums_idiomas.id = :id", { id: id })
        .getOne();
        return idioma;
    }
    async contar(id_curriculum: number) {
        const total = await getRepository(CurriculumIdioma)
        .createQueryBuilder("curriculums_idiomas")
        .leftJoinAndSelect("curriculums_idiomas.curriculum", "curriculum")
        .where("curriculums_idiomas.curriculum.id = :id", { id: id_curriculum })
        .getCount();
        return total;
    }
   
}
  
export { CurriculumIdiomaService};  