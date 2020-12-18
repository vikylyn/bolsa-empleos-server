import { injectable} from "inversify";

import { getRepository } from "typeorm";
import { IEstudioAvanzadoService } from '../interfaces/IEstudioAvanzado.service';
import { EstudioAvanzado as any } from '../entity/estudio-avanzado';


@injectable()
class EstudioAvanzadoService  implements IEstudioAvanzadoService  {
    async listar(id: number, desde: number) {
        const estudios = await 
         getRepository(any)
        .createQueryBuilder("estudios_avanzados")
        .leftJoinAndSelect("estudios_avanzados.curriculum", "curriculum")
        .leftJoinAndSelect("estudios_avanzados.pais", "pais")
        .leftJoinAndSelect("estudios_avanzados.nivel_estudio", "nivel_estudio")
        .where("estudios_avanzados.curriculum.id = :id", { id: id })
        .skip(desde)  
        .take(5)
        .getMany();
        return estudios;
    }
    async adicionar(body: any) {
        const estudio_nuevo = await  getRepository(any)
        .create({
            institucion: body.institucion,
            carrera: body.carrera,
            fecha_inicio: body.fecha_inicio,
            fecha_fin: body.fecha_fin,
            estado: body.estado,
            ciudad: body.ciudad, 
            curriculum: {id: body.id_curriculum},
            pais: {id: body.id_pais},
            nivel_estudio:{id: body.id_nivel_estudio}
        });
        const respuesta =  getRepository(any).save(estudio_nuevo);
        return respuesta;
    }
    async modificar(id: number, body: any) {
        const respuesta = await getRepository(any)
        .createQueryBuilder()
        .update(any)
        .set({
            institucion: body.institucion,
            carrera: body.carrera,
            fecha_inicio: body.fecha_inicio,
            fecha_fin: body.fecha_fin,
            estado: body.estado,
            ciudad: body.ciudad, 
            pais: {id: body.id_pais},
            nivel_estudio:{id: body.id_nivel_estudio}
        })
        .where("id = :id", { id: id })
        .execute();
        return respuesta;
    }
    async eliminar(id: number) {
        const respuesta = await getRepository(any).delete(id);
        return respuesta;
    }
    async buscar(id: number) {
        const estudio = await 
        getRepository(any)
        .createQueryBuilder("estudios_avanzados")
        .leftJoinAndSelect("estudios_avanzados.curriculum", "curriculum")
        .leftJoinAndSelect("estudios_avanzados.pais", "pais")
        .leftJoinAndSelect("estudios_avanzados.nivel_estudio", "nivel_estudio")
        .where("estudios_avanzados.id = :id", { id: id })
       .getOne();
       return estudio;
    }
    async contar(id_curriculum: number) {
        const total = await getRepository(any)
        .createQueryBuilder("estudios_avanzados")
        .leftJoinAndSelect("estudios_avanzados.curriculum", "curriculum")
        .where("estudios_avanzados.curriculum.id = :id", { id: id_curriculum })
        .getCount();
        return total;
    }
   
}
  
export {EstudioAvanzadoService};  