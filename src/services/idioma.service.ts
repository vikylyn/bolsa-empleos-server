import { injectable} from "inversify";

import { getRepository } from "typeorm";
import { IIdiomaService } from '../interfaces/IIdioma.service';
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

    listarNoAsignados(id_curriculum: Number): any {
        const idiomas = getRepository(Idioma)
        .query("SELECT * FROM idiomas AS i  WHERE NOT EXISTS (SELECT * FROM curriculums_idiomas AS c  WHERE i.id = c.idiomas_id and c.curriculum_id = ?)", [id_curriculum]);
        return idiomas ;
    }
    
   
}
  
export { IdiomaService };  
