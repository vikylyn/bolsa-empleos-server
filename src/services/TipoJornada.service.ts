import { injectable} from "inversify";

import { getRepository } from "typeorm";
import { TipoJornada } from '../entity/tipo-jornada';
import { ITipoJornadaService } from '../interfaces/ITipoJornada.service';


@injectable()
class TipoJornadaService  implements ITipoJornadaService  {
    listar(): any {
        const jornadas = getRepository(TipoJornada)
        .createQueryBuilder("tipo_jornada")
        .orderBy("tipo_jornada.id", "ASC" )
        .getMany();
       return jornadas ;
    }
   
}
  
export { TipoJornadaService };  