import { injectable} from "inversify";

import { getRepository } from "typeorm";
import { IHabilidadService } from '../interfaces/IHabilidad.service';
import { Habilidad } from '../entity/habilidad';


@injectable()
class HabilidadService  implements IHabilidadService  {
    buscar(id: number) {
        const habilidad =  getRepository(Habilidad).findOne(id);
        return habilidad;
    }
  
    async listar(id_curriculum: number): Promise<any> {
 
       console.log('id curriculum', id_curriculum)
       const habilidades = await getRepository(Habilidad)
       .query("SELECT * FROM habilidades AS h  WHERE NOT EXISTS (SELECT * FROM curriculums_habilidades AS c  WHERE h.id = c.habilidades_id and c.curriculums_id = ?)", [id_curriculum]);
       console.log(habilidades)
       return habilidades;
    }

  /*  async listarNoAsignadosCurriculum(id_curriculum: number) {
        const habilidades = await getRepository(Habilidad)
        .query("SELECT * FROM habilidades AS h  WHERE NOT EXISTS (SELECT * FROM curriculums_habilidades AS c  WHERE h.id = c.habilidades_id and c.curriculums_id = ?) ;  ", [id_curriculum]);
        return habilidades;
    }
  */ 
}
  
export { HabilidadService };  