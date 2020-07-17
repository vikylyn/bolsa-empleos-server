import { injectable} from "inversify";

import { getRepository } from "typeorm";
import { IProfesionService } from '../interfaces/profesion.service';
import { Profesion } from '../entity/profesion';


@injectable()
class ProfesionRepository  implements IProfesionService  {
    async listar(desde: number) {
        const profesiones = await getRepository(Profesion)
        .createQueryBuilder("profesiones")
        .skip(desde)  
        .take(5)
        .getMany();
        return profesiones;
    }
    async adicionar(profesion: Profesion) {
        const nuevaProfesion = getRepository(Profesion).create({
            nombre: profesion.nombre,
            habilitado: profesion.habilitado,
            administrador: profesion.administrador,
            area_laboral: profesion.area_laboral
        })
        const profesion_n =  getRepository(Profesion).save(nuevaProfesion);
        return profesion_n; 
    }
    async modificar(id: number, profesion: Profesion) {
        const profesion_m = await getRepository(Profesion)
        .createQueryBuilder()
        .update(Profesion)
        .set({
            nombre: profesion.nombre,
            habilitado: profesion.habilitado,
            administrador: profesion.administrador,
            area_laboral: profesion.area_laboral
        })
        .where("id = :id", { id: id })
        .execute();
        return profesion_m;
    }
    async eliminar(id: number) {
        const profesion = await getRepository(Profesion)
        .createQueryBuilder()
        .update(Profesion)
        .set({habilitado: false})
        .where("id = :id", { id: id })
        .execute(); 
        return profesion;
    }
    buscar(id: number) {
        const profesion =  getRepository(Profesion).findOne(id);
        return profesion;
    }
  
   
}
  
export { ProfesionRepository };  