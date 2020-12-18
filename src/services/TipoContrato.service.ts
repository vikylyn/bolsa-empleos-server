import { injectable} from "inversify";

import { getRepository } from "typeorm";
import { ITipoContratoService } from '../interfaces/ITipoContrato.service';
import { TipoContrato } from '../entity/tipo-contrato';


@injectable()
class TipoContratoService  implements ITipoContratoService  {
    buscar(id: number) {
        const contrato =  getRepository(TipoContrato).findOne(id);
        return contrato;
    }
  
    listar(): any {
        const contratos = getRepository(TipoContrato)
        .createQueryBuilder("tipo_contrato")
        .orderBy("tipo_contrato.id", "ASC" )
        .getMany();
       return contratos ;
    }
   
}
  
export { TipoContratoService };  