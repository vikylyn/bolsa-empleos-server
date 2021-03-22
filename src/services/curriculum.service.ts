import { injectable} from "inversify";
import { getRepository, getConnection } from 'typeorm';
import { ICurriculumService } from '../interfaces/ICurriculum.service';
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
              modificado_en: new Date(), 
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
        .leftJoinAndSelect("experiencias_laborales.ciudad", "experiencias_laborales_ciudad")
        .leftJoinAndSelect("experiencias_laborales_ciudad.estado", "experiencias_laborales_estado")
        .leftJoinAndSelect("experiencias_laborales_estado.pais", "experiencias_laborales_pais")
        .leftJoinAndSelect("experiencias_laborales.otraCiudad", "experiencias_laborales_otraCiudad")

        .leftJoinAndSelect("curriculums.curriculum_habilidades", "curriculum_habilidades")
        .leftJoinAndSelect("curriculum_habilidades.habilidad", "habilidad")

        .leftJoinAndSelect("curriculums.estudios_basicos", "estudios_basicos")
        .leftJoinAndSelect("estudios_basicos.grado_inicio", "grado_inicio")
        .leftJoinAndSelect("grado_inicio.nivel_escolar", "inicio_nivel.escolar")
        .leftJoinAndSelect("estudios_basicos.grado_fin", "grado_fin")
        .leftJoinAndSelect("grado_fin.nivel_escolar", "fin_nivel.escolar")
        .leftJoinAndSelect("estudios_basicos.ciudad", "basico_ciudad")
        .leftJoinAndSelect("basico_ciudad.estado", "basico_estado")
        .leftJoinAndSelect("basico_estado.pais", "basico_pais")
        .leftJoinAndSelect("estudios_basicos.otraCiudad", "otraCiudad")

        .leftJoinAndSelect("curriculums.estudios_avanzados", "estudios_avanzados")
        .leftJoinAndSelect("estudios_avanzados.nivel_estudio", "nivel_estudio")
        .leftJoinAndSelect("estudios_avanzados.ciudad", "avanzado_ciudad")
        .leftJoinAndSelect("avanzado_ciudad.estado", "avanzado_estado")
        .leftJoinAndSelect("avanzado_estado.pais", "avanzado_pais")
        .leftJoinAndSelect("estudios_avanzados.otraCiudad", "estudios_avanzados_otraCiudad")

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
        
        .where("curriculums.solicitante.id = :id", { id: id })
        .getOne();
        respuesta.solicitante.credenciales.password = "xd";
        return respuesta;
    }
  
    async verificarSiExiste(id_solicitante: number) {
        let respuesta: boolean;
        const connection = getConnection();
            const queryRunner = connection.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            try {
               const curriculum = await queryRunner.manager.getRepository(Curriculum)
                .createQueryBuilder("curriculums")
                .leftJoinAndSelect("curriculums.solicitante", "solicitante")
                .where("curriculums.solicitante.id = :id", { id: id_solicitante })
                .getOne();
                
                await queryRunner.commitTransaction();
                if (curriculum) {
                    respuesta = true;
                }else {
                    respuesta = false;
                }
            
            
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
}
  
export { CurriculumService};  