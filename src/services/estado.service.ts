
import { injectable} from "inversify";
import { getRepository } from "typeorm";
import { IEstadoService } from '../interfaces/IEstado.service';
import { Estado } from '../entity/estado';


@injectable()
class EstadoService  implements IEstadoService  {
    buscar(id: number) {
        const estado =  getRepository(Estado).findOne(id);
        return estado;
    }
    listar(): any {
        const estados = getRepository(Estado).find()
       return estados ;
    }
   
}
  
export { EstadoService };  