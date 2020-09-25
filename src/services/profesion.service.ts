import { injectable} from "inversify";

import { getRepository } from "typeorm";
import { IProfesionService } from '../interfaces/profesion.service';
import { Profesion } from '../entity/profesion';


@injectable()
class ProfesionService  implements IProfesionService  {
    async listarTodas() {
        const profesiones = await getRepository(Profesion)
        .createQueryBuilder("profesiones")
        .getMany();
        return profesiones;
    }
    async filtrar(id_area: number, id_actividad: number, desde: number) {
        if (id_area == 0 && id_actividad != 0) { 
            const profesiones = await getRepository(Profesion)
            .createQueryBuilder("profesiones")
            .leftJoinAndSelect("profesiones.area_laboral", "area_laboral")
            .leftJoinAndSelect("profesiones.actividad_laboral", "actividad_laboral")
            .where("actividad_laboral.id = :id_actividad",{id_actividad: id_actividad})
            .skip(desde)  
            .take(5)
            .getMany();
            return profesiones;
        } 
        if (id_area != 0 && id_actividad == 0) {
            const profesiones = await getRepository(Profesion)
            .createQueryBuilder("profesiones")
            .leftJoinAndSelect("profesiones.area_laboral", "area_laboral")
            .leftJoinAndSelect("profesiones.actividad_laboral", "actividad_laboral")
            .where("area_laboral.id = :id_area",{id_area: id_area})
            .skip(desde)  
            .take(5)
            .getMany();
            return profesiones;
        }
        if (id_area != 0 && id_actividad != 0) {
            const profesiones = await getRepository(Profesion)
            .createQueryBuilder("profesiones")
            .leftJoinAndSelect("profesiones.area_laboral", "area_laboral")
            .leftJoinAndSelect("profesiones.actividad_laboral", "actividad_laboral")
            .where("area_laboral.id = :id_area and actividad_laboral.id = :id_actividad",{id_area: id_area, id_actividad: id_actividad})
            .skip(desde)  
            .take(5)
            .getMany();
            return profesiones;
        }
 
    }
    async listar(desde: number) {
        const profesiones = await getRepository(Profesion)
        .createQueryBuilder("profesiones")
        .leftJoinAndSelect("profesiones.area_laboral", "area_laboral")
        .leftJoinAndSelect("profesiones.actividad_laboral", "actividad_laboral")
        .skip(desde)  
        .take(5)
        .getMany();
        return profesiones;
    }
    async adicionar(body: any) {
        const nuevaProfesion = getRepository(Profesion).create({
            nombre: body.nombre,
            habilitado: body.habilitado,
            administrador: {id: body.id_administrador},
            area_laboral: {id: body.id_area_laboral},
            actividad_laboral: {id: body.id_actividad_laboral}
        })
        const profesion_n =  getRepository(Profesion).save(nuevaProfesion);
        return profesion_n;  
    }
    async modificar(id: number, body: any) {
        let habilitar: boolean;
        if(body.habilitado === 'true' || body.habilitado === true) {
            habilitar = true;
        }else {
            habilitar = false;
        }
        const profesion_m = await getRepository(Profesion)
        .createQueryBuilder()
        .update(Profesion)
        .set({
            nombre: body.nombre,
            habilitado: habilitar,
            administrador: {id: body.id_administrador},
            area_laboral: {id: body.id_area_laboral},
            actividad_laboral: {id: body.id_actividad_laboral}
        })
        .where("id = :id", { id: id })
        .execute();
        return profesion_m;
    }
    async eliminar(id: number) {
        console.log(id);
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
/*    async buscarPorNombre(nombre: string) { 
        const profesion =  await getRepository(Profesion)
       .query("select p.id, p.nombre, p.habilitado, p.areas_laborales_id as area_laboral, p.actividades_laborales_id as actividad_laboral from profesiones p where p.nombre  regexp ?",[nombre]);
        return profesion;
    }
*/    async buscarPorNombre(nombre: string) {
        const regex = new RegExp( nombre, 'i' );

        const profesion =  await getRepository(Profesion)
        .createQueryBuilder("profesiones")
            .leftJoinAndSelect("profesiones.area_laboral", "area_laboral")
            .leftJoinAndSelect("profesiones.actividad_laboral", "actividad_laboral")
            .where("profesiones.nombre regexp :nombre",{nombre: nombre})
            .getMany()
        return profesion;
    }
    async contar() {
        const total = await getRepository(Profesion)
        .createQueryBuilder("profesiones").getCount()
        return total;
    }
    async contarFiltrados(id_area: number, id_actividad: number) {
        if (id_area == 0 && id_actividad != 0) {
            const total = await getRepository(Profesion)
            .createQueryBuilder("profesiones")
            .leftJoinAndSelect("profesiones.area_laboral", "area_laboral")
            .leftJoinAndSelect("profesiones.actividad_laboral", "actividad_laboral")
            .where("actividad_laboral.id = :id_actividad",{id_actividad: id_actividad})
            .getCount()
            return total;
        } 
        if (id_area != 0 && id_actividad == 0) {
            const total = await getRepository(Profesion)
            .createQueryBuilder("profesiones")
            .leftJoinAndSelect("profesiones.area_laboral", "area_laboral")
            .leftJoinAndSelect("profesiones.actividad_laboral", "actividad_laboral")
            .where("area_laboral.id = :id_area",{id_area: id_area})
            .getCount()
            return total;
        }
        if (id_area != 0 && id_actividad != 0) {
            const total = await getRepository(Profesion)
            .createQueryBuilder("profesiones")
            .leftJoinAndSelect("profesiones.area_laboral", "area_laboral")
            .leftJoinAndSelect("profesiones.actividad_laboral", "actividad_laboral")
            .where("area_laboral.id = :id_area and actividad_laboral.id = :id_actividad",{id_area: id_area, id_actividad: id_actividad})
            .getCount()
            return total;
        }
    }

}
  
export { ProfesionService };  