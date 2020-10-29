import { injectable} from "inversify";

import { getRepository } from "typeorm";
import { IOcupacionSolicitanteService } from "../interfaces/ocupacion-solicitante.service";
import { OcupacionSolicitante } from '../entity/ocupacion-solicitante';


@injectable()
class OcupacionSolicitanteService  implements IOcupacionSolicitanteService  {

    async listar(id_solicitante: number, desde: number) {
        const ocupaciones = await getRepository(OcupacionSolicitante)
        .createQueryBuilder("ocupaciones_solicitantes")
        .leftJoinAndSelect("ocupaciones_solicitantes.ocupacion", "ocupacion")
        .leftJoinAndSelect("ocupaciones_solicitantes.solicitante", "solicitante")
        .where("solicitante.id = :id_solicitante", {id_solicitante: id_solicitante})
        .skip(desde)  
        .take(5)
        .getMany();
        return ocupaciones;
    }
    async adicionar(body: any) {
        const nuevaOcupacion = getRepository(OcupacionSolicitante).create({
            solicitante: body.solicitante,
            ocupacion: body.ocupacion,
            habilitado: body.habilitado
        })
        const ocupacion_n =  getRepository(OcupacionSolicitante).save(nuevaOcupacion);
        return ocupacion_n;  
    }
    async eliminar(id: number) {
        const ocupacion = await getRepository(OcupacionSolicitante)
        .createQueryBuilder()
        .update(OcupacionSolicitante)
        .set({habilitado: false})
        .where("id = :id", { id: id })
        .execute(); 
        return ocupacion;
    }
    async habilitar(id: number) {
        const ocupacion = await getRepository(OcupacionSolicitante)
        .createQueryBuilder()
        .update(OcupacionSolicitante)
        .set({habilitado: true})
        .where("id = :id", { id: id })
        .execute(); 
        return ocupacion;
    }
    async contar(id_solicitante: number) {
        const total = await getRepository(OcupacionSolicitante)
        .createQueryBuilder("ocupaciones_solicitantes")
        .leftJoinAndSelect("ocupaciones_solicitantes.ocupacion", "ocupacion")
        .leftJoinAndSelect("ocupaciones_solicitantes.solicitante", "solicitante")
        .where("solicitante.id = :id_solicitante", {id_solicitante: id_solicitante})
        .getCount();
        return total;
    }


}
  
export { OcupacionSolicitanteService};  