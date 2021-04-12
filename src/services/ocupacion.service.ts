import { injectable} from "inversify";

import { getRepository } from "typeorm";
import { IOcupacionService } from '../interfaces/IOcupacion.service';
import { Ocupacion } from '../entity/ocupacion';
import { OcupacionSolicitante } from '../entity/ocupacion-solicitante';


@injectable()
class OcupacionService  implements IOcupacionService  {
    async listarTodas() {
        const ocupaciones = await getRepository(Ocupacion)
        .createQueryBuilder("ocupaciones")
        .getMany();
        return ocupaciones;
    }
    async filtrar(id_grupo: number, desde: number) {
        console.log(id_grupo)
        if (id_grupo == 0) { 
            const ocupaciones = await getRepository(Ocupacion)
            .createQueryBuilder("ocupaciones")
            .leftJoinAndSelect("ocupaciones.grupo_ocupacional", "grupo_ocupacional")
            .skip(desde)  
            .take(5)
            .getMany();
            return ocupaciones;
        } 
        if (id_grupo != 0 ) {
            const ocupaciones = await getRepository(Ocupacion)
            .createQueryBuilder("ocupaciones")
            .leftJoinAndSelect("ocupaciones.grupo_ocupacional", "grupo_ocupacional")
            .where("grupo_ocupacional.id = :id_grupo",{id_grupo: id_grupo})
            .skip(desde)  
            .take(5)
            .getMany();
            return ocupaciones;
        }
 
    }
    async listar(desde: number) {
        const ocupaciones = await getRepository(Ocupacion)
        .createQueryBuilder("ocupaciones")
        .leftJoinAndSelect("ocupaciones.grupo_ocupacional", "grupo_ocupacional")
        .skip(desde)  
        .take(5)
        .getMany();
        return ocupaciones;
    }
    async adicionar(body: any) {
        const nuevaOcupacion = getRepository(Ocupacion).create({
            nombre: body.nombre,
            habilitado: body.habilitado,
            administrador: {id: body.id_administrador},
            grupo_ocupacional: {id: body.id_grupo_ocupacional},
        })
        const ocupacion_n =  getRepository(Ocupacion).save(nuevaOcupacion);
        return ocupacion_n;  
    }
    async modificar(id: number, body: any) {
        let habilitar: boolean;
        if(body.habilitado === 'true' || body.habilitado === true) {
            habilitar = true;
        }else {
            habilitar = false;
        }
        const ocupacion_m = await getRepository(Ocupacion)
        .createQueryBuilder()
        .update(Ocupacion)
        .set({
            nombre: body.nombre,
            habilitado: habilitar,
            administrador: {id: body.id_administrador},
            grupo_ocupacional: {id: body.id_grupo_ocupacional},
        })
        .where("id = :id", { id: id })
        .execute();
        return ocupacion_m;
    }
    async inhabilitar(id: number) {
        
        const ocupacion = await getRepository(Ocupacion)
        .createQueryBuilder()
        .update(Ocupacion)
        .set({habilitado: false})
        .where("id = :id", { id: id })
        .execute(); 
        return ocupacion;
    }
    async habilitar(id: number) {
        console.log(id);
        const ocupacion = await getRepository(Ocupacion)
        .createQueryBuilder()
        .update(Ocupacion)
        .set({habilitado: true})
        .where("id = :id", { id: id })
        .execute(); 
        return ocupacion;
    }
    async buscar(id: number) {
        const ocupacion =  getRepository(Ocupacion)
        .createQueryBuilder("ocupaciones")
        .leftJoinAndSelect("ocupaciones.grupo_ocupacional", "grupo_ocupacional")
        .where("ocupaciones.id = :id",{id: id})
        .getOne()
        return ocupacion;
    }
 
    async buscarPorNombre(nombre: string) {
        const ocupacion =  await getRepository(Ocupacion)
        .createQueryBuilder("ocupaciones")
            .leftJoinAndSelect("ocupaciones.grupo_ocupacional", "grupo_ocupacional")
            .where("ocupaciones.nombre regexp :nombre",{nombre: nombre})
            .getMany()
        return ocupacion;
    }
    async contar() {
        const total = await getRepository(Ocupacion)
        .createQueryBuilder("ocupaciones").getCount()
        return total;
    }
    async contarFiltrados(id_grupo: number) {
        if (id_grupo == 0) {
            const total = await getRepository(Ocupacion)
            .createQueryBuilder("ocupaciones")
            .leftJoinAndSelect("ocupaciones.grupo_ocupacional", "grupo_ocupacional")
            .getCount()
            return total;
        } 
        if (id_grupo != 0) {
            const total = await getRepository(Ocupacion)
            .createQueryBuilder("ocupaciones")
            .leftJoinAndSelect("ocupaciones.grupo_ocupacional", "grupo_ocupacional")
            .where("ocupaciones.grupo_ocupacional.id = :id_grupo",{id_grupo: id_grupo})
            .getCount()
            return total;
        }
    }

    async listarNoAsignadosSolicitante(id_solicitante: number) {
        const ocupaciones = await getRepository(Ocupacion)
        .query("SELECT * FROM ocupaciones AS a  WHERE NOT EXISTS (SELECT * FROM ocupaciones_solicitantes AS b  WHERE a.id = b.ocupacion_id and b.solicitante_id = ?)", [id_solicitante]);
        
    /*   .createQueryBuilder("ocupaciones")
       .where("NOT EXISTS (SELECT * FROM ocupaciones_solicitantes AS b  WHERE a.id = b.ocupacion_id and b.solicitante_id = :id_solicitante);",{id_solicitante : id_solicitante})
        .getMany()
    */
        return ocupaciones;
    }


}
  
export { OcupacionService as ProfesionService };  