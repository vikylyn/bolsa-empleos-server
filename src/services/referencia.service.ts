import { injectable} from "inversify";

import { getRepository } from "typeorm";
import { IReferenciaService } from '../interfaces/IReferencias.service';
import { Referencia } from '../entity/referencia';


@injectable()
class ReferenciaService  implements IReferenciaService  {
    async listar(desde: number, id_curriculum: number) {
        const referencias = await  getRepository(Referencia)
        .createQueryBuilder("referencias")
        .leftJoinAndSelect("referencias.curriculum", "curriculum")
        .where("referencias.curriculum.id = :id", { id: id_curriculum })
        .skip(desde)  
        .take(5)
        .getMany();

        return referencias;
    }
    async adicionar(body: any) {
        const referencia_nueva = await  getRepository(Referencia)
        .create({
            nombre: body.nombre, 
            apellidos: body.apellidos, 
            empresa: body.empresa, 
            cargo: body.cargo, 
            telefono: body.telefono,
            curriculum: {id: body.id_curriculum}
        });
        const respuesta =  getRepository(Referencia).save(referencia_nueva);
        return respuesta; 
    }
    async modificar(id: number, body: any) {
        const respuesta = await getRepository(Referencia)
        .createQueryBuilder()
        .update(Referencia)
        .set({
            nombre: body.nombre, 
            apellidos: body.apellidos, 
            empresa: body.empresa, 
            cargo: body.cargo, 
            telefono: body.telefono
        })
        .where("id = :id", { id: id })
        .execute();
        return respuesta;
    }
    async eliminar(id: number) {
        const referencia = await getRepository(Referencia).delete(id);
        return referencia;
    }
    async buscar(id: number) {
        const referencia =  await getRepository(Referencia).findOne(id);
        return referencia;
    }
    async contar(id_curriculum: number) {
        const total = await getRepository(Referencia)
        .createQueryBuilder("referencias")
        .leftJoinAndSelect("referencias.curriculum", "curriculum")
        .where("referencias.curriculum.id = :id", { id: id_curriculum })
        .getCount();
        return total;
    }
   
}
  
export { ReferenciaService};  