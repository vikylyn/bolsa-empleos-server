import { injectable} from "inversify";

import { getRepository } from "typeorm";
import { IRolService } from '../interfaces/IRol.service';
import { Rol } from "../entity/rol";
import { IImagenService } from '../interfaces/IImagen.service';
import { Imagen } from "../entity/imagen";


@injectable()
class ImagenService  implements IImagenService  {
    async modificar(id: number, imagen: Imagen) {
        const imagen_modificada = await getRepository(Imagen)
        .createQueryBuilder()
        .update(Imagen)
        .set({
            id_cloudinary: imagen.id_cloudinary,
            formato: imagen.formato,
            url: imagen.url,
            url_segura: imagen.url_segura
        })
        .where("id = :id", { id: id })
        .execute();
        return imagen_modificada;
    }
    async buscar(id: number) {
        const imagen = await  getRepository(Imagen).findOne(id);
        return imagen;
    }
  
    
   
}
  
export { ImagenService };  