import { injectable} from "inversify";

import { getRepository } from "typeorm";
import { IRazonSocialService } from '../interfaces/IRazonSocial.service';
import { RazonSocial } from '../entity/razon-social';


@injectable()
class RazonSocialService  implements IRazonSocialService  {

    listar(): any {
        const razones_sociales = getRepository(RazonSocial)
        .createQueryBuilder("razon_social")
        .orderBy("razon_social.id", "ASC" )
        .getMany();
       return razones_sociales ;
    }
   
}
  
export { RazonSocialService };  