import { injectable} from "inversify";

import { getRepository } from "typeorm";
import { IIdiomaService } from '../interfaces/idioma.service';
import { Idioma } from '../entity/idioma';


@injectable()
class IdiomaService  implements IIdiomaService  {
    buscar(id: number) {
        const idioma =  getRepository(Idioma).findOne(id);
        return idioma;
    }
  
    listar(): any {
        const idiomas = getRepository(Idioma).find()
       return idiomas ;
    }
   
}
  
export { IdiomaService };  