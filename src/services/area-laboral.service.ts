import { injectable} from "inversify";

import { getRepository } from "typeorm";
import { IAreaLaboralService } from '../interfaces/area-laboral.service';
import { AreaLaboral } from '../entity/area-laboral';


@injectable()
class AreaLaboralService  implements IAreaLaboralService  {
    async listarTodas() {
        const areas = await getRepository(AreaLaboral)
        .createQueryBuilder("areas_laborales")
        .getMany();
        return areas;
    }
    async contar() {
        const total = await getRepository(AreaLaboral)
        .createQueryBuilder("areas_laborales").getCount()
        return total;
    }
    async listar(desde: number) {
        const areas = await getRepository(AreaLaboral)
        .createQueryBuilder("areas_laborales")
        .skip(desde)  
        .take(5)
        .getMany();
        return areas;
    }

    async adicionar(area: any) {
        const nuevaArea = await  getRepository(AreaLaboral)
        .create({
                nombre: area.nombre, 
                habilitado: area.habilitado, 
                administrador: {id: area.administrador}
            });
        const area_n =  getRepository(AreaLaboral).save(nuevaArea);
        return area_n; 
    }
    async modificar(id: number, body: any) {
        console.log(body.habilitado);
        let habilitar: boolean;
        if(body.habilitado === 'true' || body.habilitado === true) {
            habilitar = true;
        }else {
            habilitar = false;
        }
        const area_m = await getRepository(AreaLaboral)
        .createQueryBuilder()
        .update(AreaLaboral)
        .set({
            nombre:body.nombre, 
            habilitado: habilitar,
            administrador: {id: body.administrador}})
        .where("id = :id", { id: id })
        .execute();
        console.log(area_m)
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
    async buscar(id: number) {
        const area =  await getRepository(AreaLaboral).findOne(id);
        return area;
    }
  
   async buscarPorNombre(nombre: string) {
       const areas =  await getRepository(AreaLaboral)
       .createQueryBuilder("areas_laborales")
       .where("areas_laborales.nombre regexp :nombre",{nombre: nombre})
       .getMany()
       return areas;
    } 
}
  
export { AreaLaboralService};  