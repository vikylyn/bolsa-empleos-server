import { injectable} from "inversify";
import { IInformacionAppService } from '../interfaces/IInformacionApp.service';
import { InformacionApp } from '../entity/informacionApp';
import { getRepository } from 'typeorm';


@injectable()
class InformacionAppService  implements IInformacionAppService  {
    buscar(id_informacion: number) {
        const informacion =  getRepository(InformacionApp).findOne(id_informacion);
        return informacion;
    }
    async modificar(id_informacion: number, body: any) {
        const respuesta = await getRepository(InformacionApp)
        .createQueryBuilder()
        .update(InformacionApp)
        .set({
            nombre: body.nombre,
            eslogan: body.eslogan,
            descripcion: body.descripcion,
            telefono: body.telefono,
            email: body.email,
            direccion: body.direccion,
            ciudad: {id: body.id_ciudad},
            modificado_en: new Date()
        })
        .where("id = :id", { id: id_informacion })
        .execute();
        return respuesta;
    }
  
}
  
export { InformacionAppService };  