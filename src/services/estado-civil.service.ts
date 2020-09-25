import { injectable} from "inversify";

import { getRepository } from "typeorm";

import { IEstadoCivilService } from '../interfaces/estado-civil.service';
import { EstadoCivil } from '../entity/estado-civil';


@injectable()
class EstadoCivilService  implements IEstadoCivilService  {
    buscar(id: number) {
        const rol =  getRepository(EstadoCivil).findOne(id);
        return rol;
    }
  
    listar(): any {
        const roles = getRepository(EstadoCivil).find()
       return roles ;
    }
   
}
  
export { EstadoCivilService };  