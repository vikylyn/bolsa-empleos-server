import { injectable} from "inversify";

import { getRepository } from "typeorm";
import { GradoEscolar } from '../entity/grado-escolar';
import { IGradoEscolarService } from '../interfaces/IGradoEscolar.service';


@injectable()
class GradoEscolarService  implements IGradoEscolarService  {
    buscar(id: number) {
        const grado =  getRepository(GradoEscolar).findOne(id);
        return grado;
    }
  
    listar(): any {
        const grados = getRepository(GradoEscolar)
        .createQueryBuilder("grados")
        .leftJoinAndSelect("grados.nivel_escolar", "nivel_escolar")
        .orderBy("grados.id")
        .getMany();
       return grados ;
    }
   
}
  
export { GradoEscolarService };  