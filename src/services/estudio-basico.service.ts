import { injectable} from "inversify";

import { getRepository } from "typeorm";
import { IEstudioBasicoService } from '../interfaces/estudio-basico.service';
import { EstudioBasico } from '../entity/estudio-basico';


@injectable()
class EstudioBasicoService  implements IEstudioBasicoService  {
    async listar(id: number, desde: number) {
        const estudios = await 
         getRepository(EstudioBasico)
        .createQueryBuilder("estudios_basicos")
        .leftJoinAndSelect("estudios_basicos.curriculum", "curriculum")
        .leftJoinAndSelect("estudios_basicos.pais", "pais")
        .leftJoinAndSelect("estudios_basicos.grado_inicio", "grado_inicio")
        .leftJoinAndSelect("estudios_basicos.grado_fin", "grado_fin")
        .leftJoinAndSelect("grado_inicio.nivel_escolar", "nivel_escolar1")
        .leftJoinAndSelect("grado_fin.nivel_escolar", "nivel_escolar2")
        .where("estudios_basicos.curriculum.id = :id", { id: id })
        .skip(desde)  
        .take(5)
        .getMany();
        return estudios;
    }
    async adicionar(body: any) {
        const estudio_nuevo = await  getRepository(EstudioBasico)
        .create({
            colegio: body.colegio,
            fecha_inicio: body.fecha_inicio,
            fecha_fin: body.fecha_fin,
            estado: body.estado,
            ciudad: body.ciudad, 
            curriculum: {id: body.id_curriculum},
            pais: {id: body.id_pais},
            grado_inicio: {id: body.id_grado_inicio},
            grado_fin: {id: body.id_grado_fin}
        });
        const respuesta =  getRepository(EstudioBasico).save(estudio_nuevo);
        return respuesta;
    }
    async modificar(id: number, body: any) {
        const respuesta = await getRepository(EstudioBasico)
        .createQueryBuilder()
        .update( EstudioBasico)
        .set({
            colegio: body.colegio,
            fecha_inicio: body.fecha_inicio,
            fecha_fin: body.fecha_fin,
            estado: body.estado,
            ciudad: body.ciudad, 
            pais: {id: body.id_pais},
            grado_inicio: {id: body.id_grado_inicio},
            grado_fin: {id: body.id_grado_fin}
        })
        .where("id = :id", { id: id })
        .execute();
        return respuesta;
    }
    async eliminar(id: number) {
        const respuesta = await getRepository(EstudioBasico).delete(id);
        return respuesta;
    }
    async buscar(id: number) {
        const estudio = await 
        getRepository(EstudioBasico)
        .createQueryBuilder("estudios_basicos")
        .leftJoinAndSelect("estudios_basicos.curriculum", "curriculum")
        .leftJoinAndSelect("estudios_basicos.pais", "pais")
        .leftJoinAndSelect("estudios_basicos.grado_inicio", "grado_inicio")
        .leftJoinAndSelect("estudios_basicos.grado_fin", "grado_fin")
        .where("estudios_basicos.id = :id", { id: id })
       .getOne();
       return estudio;
    }

    async contar(id_curriculum: number) {
        const total = await getRepository(EstudioBasico)
        .createQueryBuilder("estudios_basicos")
        .leftJoinAndSelect("estudios_basicos.curriculum", "curriculum")
        .where("estudios_basicos.curriculum.id = :id", { id: id_curriculum })
        .getCount();
        return total;
    }
   
   
}
  
export {EstudioBasicoService};  