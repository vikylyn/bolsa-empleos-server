import { injectable} from "inversify";

import { getRepository } from "typeorm";
import { IHabilidadService } from '../interfaces/habilidad.service';
import { Habilidad } from '../entity/habilidad';


@injectable()
class HabilidadService  implements IHabilidadService  {
    buscar(id: number) {
        const habilidad =  getRepository(Habilidad).findOne(id);
        return habilidad;
    }
  
    listar(): any {
        const habilidades = getRepository(Habilidad).find()
       return habilidades ;
    }
   
}
  
export { HabilidadService };  