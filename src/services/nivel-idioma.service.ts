import { injectable} from "inversify";

import { getRepository } from "typeorm";

import { INivelIdiomaService } from '../interfaces/INivelIdioma.service';
import { NivelIdioma } from '../entity/nivel-idioma';


@injectable()
class NivelIdiomaService  implements INivelIdiomaService  {
    buscar(id: number) {
        const nivel_idioma = getRepository(NivelIdioma).findOne(id);
        return nivel_idioma;  
    }
  
    listar(): any {
       const niveles_idiomas = getRepository(NivelIdioma).find();
       return niveles_idiomas ;
    }
   
}
  
export { NivelIdiomaService };  