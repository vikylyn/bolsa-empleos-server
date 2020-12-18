import { injectable} from "inversify";
import { getRepository } from "typeorm";
import { IGrupoOcupacionalService } from '../interfaces/IGrupoOcupacional.service';
import { GrupoOcupacional } from '../entity/grupo-ocupacional';


@injectable()
class GrupoOcupacionalService  implements IGrupoOcupacionalService  {
    async listarTodas() {
        const grupos = await getRepository(GrupoOcupacional)
        .createQueryBuilder("grupos_ocupacionales")
        .getMany();
        return grupos;
    }
    async contar() {
        const total = await getRepository(GrupoOcupacional)
        .createQueryBuilder("grupos_ocupacionales").getCount()
        return total;
    }
    async listar(desde: number) {
        const grupos = await getRepository(GrupoOcupacional)
        .createQueryBuilder("grupos_ocupacionales")
        .skip(desde)  
        .take(5)
        .getMany();
        return grupos;
    }

    async adicionar(area: any) {
        const nuevaGrupo = await  getRepository(GrupoOcupacional)
        .create({
                nombre: area.nombre, 
                habilitado: area.habilitado, 
                administrador: {id: area.id_administrador}
            });
        const grupo_n =  getRepository(GrupoOcupacional).save(nuevaGrupo);
        return grupo_n; 
    }
    async modificar(id: number, body: any) {
        let habilitar: boolean;
        if(body.habilitado === 'true' || body.habilitado === true) {
            habilitar = true;
        }else {
            habilitar = false;
        }
        const grupo_m = await getRepository(GrupoOcupacional)
        .createQueryBuilder()
        .update(GrupoOcupacional)
        .set({
            nombre:body.nombre, 
            habilitado: habilitar,
            administrador: {id: body.id_administrador}})
        .where("id = :id", { id: id })
        .execute();
        return grupo_m;  
    }
    async inhabilitar(id: number) {
        const grupo = await getRepository(GrupoOcupacional)
        .createQueryBuilder()
        .update(GrupoOcupacional)
        .set({habilitado: false})
        .where("id = :id", { id: id })
        .execute(); 
        return grupo;
    }
    async habilitar(id: number) {
        const grupo = await getRepository(GrupoOcupacional)
        .createQueryBuilder()
        .update(GrupoOcupacional)
        .set({habilitado: true})
        .where("id = :id", { id: id })
        .execute(); 
        return grupo;
    }
    async buscar(id: number) {
        const grupo =  await getRepository(GrupoOcupacional).findOne(id);
        return grupo;
    }
  
   async buscarPorNombre(nombre: string) {
       const grupos =  await getRepository(GrupoOcupacional)
       .createQueryBuilder("grupos_ocupacionales")
       .where("grupos_ocupacionales.nombre regexp :nombre",{nombre: nombre})
       .getMany()
       return grupos;
    } 
}
  
export { GrupoOcupacionalService};  