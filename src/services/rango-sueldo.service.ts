import { injectable} from "inversify";

import { getRepository } from "typeorm";
import { IRangoSueldoService } from '../interfaces/IRangoSueldo.service';
import { RangoSueldo } from '../entity/rango-sueldo';


@injectable()
class RangoSueldoService  implements IRangoSueldoService  {
    buscar(id: number) {
        const sueldo =  getRepository(RangoSueldo).findOne(id);
        return sueldo;
    }
  
    listar(): any {
        const sueldos = getRepository(RangoSueldo)
        .createQueryBuilder("sueldos")
        .orderBy("sueldos.id", "ASC" )
        .getMany();
       return sueldos ;
    }
   
}
  
export { RangoSueldoService };  