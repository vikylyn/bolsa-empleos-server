import { injectable} from "inversify";

import { getRepository } from "typeorm";
import { IActividadLaboralService } from '../interfaces/actividad-laboral.service';
import { ActividadLaboral } from '../entity/actividad-laboral';


@injectable()
class ActividadLaboralService  implements IActividadLaboralService  {
    async listar() {
        const actividades = await getRepository(ActividadLaboral)
        .createQueryBuilder("actividades_laborales")
        .getMany();
        return actividades;
    }
}
  
export { ActividadLaboralService};  