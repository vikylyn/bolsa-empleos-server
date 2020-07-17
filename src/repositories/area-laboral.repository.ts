import { injectable} from "inversify";

import { getRepository } from "typeorm";
import { IAreaLaboralService } from '../interfaces/area-laboral.service';
import { AreaLaboral } from '../entity/area-laboral';


@injectable()
class AreaLaboralRepository  implements IAreaLaboralService  {
    async listar(desde: number) {
        const areas = await getRepository(AreaLaboral)
        .createQueryBuilder("areas_laborales")
        .skip(desde)  
        .take(5)
        .getMany();
        return areas;
    }
    async adicionar(area: AreaLaboral) {
        const nuevaArea = await  getRepository(AreaLaboral).create({nombre: area.nombre, habilitado: area.habilitado, administrador: area.administrador})
        const area_n =  getRepository(AreaLaboral).save(nuevaArea);
        return area_n; 
    }
    async modificar(id: number, area: AreaLaboral) {
        const area_m = await getRepository(AreaLaboral)
        .createQueryBuilder()
        .update(AreaLaboral)
        .set({nombre: area.nombre, habilitado: area.habilitado, administrador: area.administrador})
        .where("id = :id", { id: id })
        .execute();
        return area_m;  
    }
    async eliminar(id: number) {
        const area = await getRepository(AreaLaboral)
        .createQueryBuilder()
        .update(AreaLaboral)
        .set({habilitado: false})
        .where("id = :id", { id: id })
        .execute(); 
        return area;
    }
    buscar(id: number) {
        const area =  getRepository(AreaLaboral).findOne(id);
        return area;
    }
  
   
}
  
export { AreaLaboralRepository };  