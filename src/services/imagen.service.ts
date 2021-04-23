import { injectable} from "inversify";

import { getRepository, getConnection } from 'typeorm';
import { IImagenService } from '../interfaces/IImagen.service';
import { Imagen } from "../entity/imagen";


@injectable()
class ImagenService  implements IImagenService  {
    async modificar(id: number, imagen: Imagen) {
        let respuesta = await getRepository(Imagen)
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
        console.log(respuesta);
        if (respuesta.raw.affectedRows === 1 && respuesta.raw.changedRows === 1 && respuesta.raw.warningCount === 0) {
            return true;
        }else {
            return false;
        }
       
    }
    async buscar(id: number) {
        const imagen = await  getRepository(Imagen).findOne(id);
        return imagen;
    }
  
    
   
}
  
export { ImagenService };  