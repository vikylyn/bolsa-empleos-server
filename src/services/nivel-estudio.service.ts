import { injectable} from "inversify";

import { getRepository } from "typeorm";
import { INivelEstudioService } from '../interfaces/nivel-estudio.service';
import { NivelEstudio } from '../entity/nivel-estudio';


@injectable()
class NivelEstudioService  implements INivelEstudioService  {
    buscar(id: number) {
        const nivel_estudio =  getRepository(NivelEstudio).findOne(id);
        return nivel_estudio;
    }
  
    listar(): any {
        const niveles = getRepository(NivelEstudio).find()
       return niveles ;  
    }
   
}
  
export { NivelEstudioService };  