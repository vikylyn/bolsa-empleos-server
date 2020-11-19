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
    async buscarPorIdSolicitanteCompleto(id: number) {
        const respuesta = await getRepository(Curriculum)
        .createQueryBuilder("curriculums")
        .leftJoinAndSelect("curriculums.experiencias_laborales", "experiencias_laborales")
        .leftJoinAndSelect("experiencias_laborales.pais", "experiencia_pais")

        .leftJoinAndSelect("curriculums.curriculum_habilidades", "curriculum_habilidades")
        .leftJoinAndSelect("curriculum_habilidades.habilidad", "habilidad")

        .leftJoinAndSelect("curriculums.estudios_basicos", "estudios_basicos")
        .leftJoinAndSelect("estudios_basicos.grado_inicio", "grado_inicio")
        .leftJoinAndSelect("grado_inicio.nivel_escolar", "inicio_nivel.escolar")
        .leftJoinAndSelect("estudios_basicos.grado_fin", "grado_fin")
        .leftJoinAndSelect("grado_fin.nivel_escolar", "fin_nivel.escolar")
        .leftJoinAndSelect("estudios_basicos.pais", "estudio_pais")


        .leftJoinAndSelect("curriculums.estudios_avanzados", "estudios_avanzados")
        .leftJoinAndSelect("estudios_avanzados.nivel_estudio", "nivel_estudio")
        .leftJoinAndSelect("estudios_avanzados.pais", "avanzado_pais")

        .leftJoinAndSelect("curriculums.referencias", "referencias")

        .leftJoinAndSelect("curriculums.curriculum_idiomas", "curriculum_idiomas")
        .leftJoinAndSelect("curriculum_idiomas.idioma", "idioma")
        .leftJoinAndSelect("curriculum_idiomas.nivel_escrito", "nivel_escrito")
        .leftJoinAndSelect("curriculum_idiomas.nivel_lectura", "nivel_lectura")
        .leftJoinAndSelect("curriculum_idiomas.nivel_oral", "nivel_oral")

        .leftJoinAndSelect("curriculums.solicitante", "solicitante")
        .leftJoinAndSelect("solicitante.imagen", "imagen")
        .leftJoinAndSelect("solicitante.ocupaciones", "ocupaciones")
        .leftJoinAndSelect("solicitante.credenciales", "credenciales")
        .leftJoinAndSelect("solicitante.ciudad", "ciudad")
        .leftJoinAndSelect("ciudad.estado", "estado")
        .leftJoinAndSelect("estado.pais", "pais")
        .leftJoinAndSelect("ocupaciones.ocupacion", "ocupacion")
        
        .where("curriculums.solicitante.id = :id and ocupaciones.habilitado = true", { id: id })
        .getOne();
        respuesta.solicitante.credenciales.password = "xd";
        return respuesta;
    }
  
   
}
  
export { CurriculumService};  