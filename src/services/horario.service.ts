import { injectable} from "inversify";

import { getRepository } from "typeorm";
import { IHorarioService } from '../interfaces/IHorario.service';
import { Horario } from '../entity/horario';


@injectable()
class HorarioService  implements IHorarioService  {
    buscar(id: number) {
        const horario =  getRepository(Horario).findOne(id);
        return horario;
    }
  
    listar(): any {
        const horarios = getRepository(Horario)
        .createQueryBuilder("horarios")
        .orderBy("horarios.id", "ASC" )
        .getMany();
       return horarios ;
    }
   
}
  
export { HorarioService };  