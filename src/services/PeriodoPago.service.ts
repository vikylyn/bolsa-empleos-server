import { injectable} from "inversify";

import { getRepository } from "typeorm";
import { IPeriodoPagoService } from '../interfaces/IPeriodoPago.service';
import { PeriodoPago } from '../entity/periodo-pago';


@injectable()
class PeriodoPagoService  implements IPeriodoPagoService  {
  
    listar(): any {
        const contratos = getRepository(PeriodoPago)
        .createQueryBuilder("periodo_de_pago")
        .orderBy("periodo_de_pago.id", "ASC" )
        .getMany();
       return contratos ;
    }
   
}
  
export { PeriodoPagoService };  