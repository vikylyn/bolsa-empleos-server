import { injectable} from "inversify";

import { getRepository } from "typeorm";
import { IRolService } from '../interfaces/rol.service';
import { Rol } from "../entity/rol";


@injectable()
class RolRepository  implements IRolService  {
    buscar(id: number) {
        const rol =  getRepository(Rol).findOne(id);
        return rol;
    }
  
    listar(): any {
        const roles = getRepository(Rol).find()
       return roles ;
    }
   
}
  
export { RolRepository };  