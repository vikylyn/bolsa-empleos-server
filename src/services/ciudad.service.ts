
import { injectable} from "inversify";
import { getRepository } from "typeorm";
import { Estado } from '../entity/estado';
import { ICiudadService } from '../interfaces/ICiudad.service';
import { Ciudad } from '../entity/ciudad';


@injectable()
class CiudadService  implements ICiudadService  {
    buscar(id: number) {
        const ciudad =  getRepository(Ciudad).findOne(id);
        return ciudad;
    }
 /*   listar(): any {
        const ciudades = getRepository(Ciudad).find()
       return ciudades ;
    }
*/
    listar(id: number): any {
        const ciudades = getRepository(Ciudad)
        .createQueryBuilder("ciudades")
        .leftJoinAndSelect("ciudades.estado", "estado")
        .where("estado.pais.id = :id", { id: id })
        .getMany();
       return ciudades ;
    }
   
}
  
export { CiudadService };  