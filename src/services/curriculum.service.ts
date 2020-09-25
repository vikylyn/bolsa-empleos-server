import { injectable} from "inversify";
import { getRepository } from "typeorm";
import { ICurriculumService } from '../interfaces/curriculum.service';
import { Curriculum } from '../entity/curriculum';


@injectable()
class CurriculumService  implements ICurriculumService  {

    // Podria no ser necesario
    async listar(desde: number) {
        const curriculums = await getRepository(Curriculum)
        .createQueryBuilder("curriculums")
        .skip(desde)  
        .take(5)
        .getMany();
        return curriculums;
    }

    async adicionar(body: any) {
        const nuevo_curriculum = await  getRepository(Curriculum)
        .create({
                 titulo: body.titulo, 
                 pretension_salarial: body.pretension_salarial, 
                 biografia: body.biografia, 
                 solicitante: {id: body.id_solicitante}
                });
        const respuesta =  getRepository(Curriculum).save(nuevo_curriculum);
        return respuesta; 
    }
    async modificar(id: number, curriculum: Curriculum) {
        const respuesta = await getRepository(Curriculum)
        .createQueryBuilder()
        .update(Curriculum)
        .set({titulo: curriculum.titulo, 
              pretension_salarial: curriculum.pretension_salarial, 
              biografia: curriculum.biografia})
        .where("id = :id", { id: id })
        .execute();
        return respuesta;
    }
    // podria no ser necesario
    async buscarPorId(id: number) {
        const respuesta = await getRepository(Curriculum).findOne(id);

        if(respuesta){
            respuesta.solicitante.credenciales.password = "xD"; 
        }
        return respuesta;
    }
    async buscarPorIdSolicitante(id: number) {
        const respuesta = await getRepository(Curriculum)
        .createQueryBuilder("curriculums")
        .leftJoinAndSelect("curriculums.solicitante", "solicitante")
        .where("curriculums.solicitante.id = :id", { id: id })
        .getOne();
    
        return respuesta;
    }
   
  
   
}
  
export { CurriculumService};  