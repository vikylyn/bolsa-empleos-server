import { injectable} from "inversify";

import { getRepository, getConnection } from 'typeorm';
import { ICurriculumHabilidadService } from '../interfaces/curriculum-habilidad.service';
import { CurriculumHabilidad } from '../entity/curriculum-habilidad';


@injectable()
class CurriculumHabilidadService  implements ICurriculumHabilidadService  {
    async listar(id: number, desde: number) {
        const habilidades = await 
         getRepository(CurriculumHabilidad)
        .createQueryBuilder("curriculums_habilidades")
        .leftJoinAndSelect("curriculums_habilidades.habilidad", "habilidad")
        .leftJoinAndSelect("curriculums_habilidades.curriculum", "curriculum")
        .where("curriculums_habilidades.curriculum.id = :id", { id: id })
        .skip(desde)  
        .take(5)
        .getMany();
        return habilidades;
    }
    async adicionar(body: any) {
        let respuesta: boolean;
        const connection = getConnection();
            const queryRunner = connection.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            try {
                const idHabilidades: string = body.id_habilidad;
                for (let index = 0; index < idHabilidades.length; index++) {
                    let habilidad = await queryRunner.manager.save(CurriculumHabilidad,
                        {
                            curriculum: {id: body.id_curriculum},
                            habilidad:{id: parseInt(idHabilidades[index])}
                        });
                }
    
                await queryRunner.commitTransaction();

                respuesta = true;
            
            
            } catch (err) {
            
                // since we have errors let's rollback changes we made
                await queryRunner.rollbackTransaction();
                respuesta = err;
            
            } finally {
            
                // you need to release query runner which is manually created:
                await queryRunner.release();
            }

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