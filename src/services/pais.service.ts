import { injectable} from "inversify";
import { getRepository } from "typeorm";
import { IPaisService } from '../interfaces/pais.service';
import { Pais } from '../entity/pais';


@injectable()
class PaisService  implements IPaisService  {
    buscar(id: number) {
        const pais =  getRepository(Pais).findOne(id);
        return pais;
    }
    listar(): any {
        const paises = getRepository(Pais).find()
       return paises ;
    }
   
}
  
export { PaisService };  