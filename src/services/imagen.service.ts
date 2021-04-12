import { injectable} from "inversify";

import { getRepository, getConnection } from 'typeorm';
import { IImagenService } from '../interfaces/IImagen.service';
import { Imagen } from "../entity/imagen";


@injectable()
class ImagenService  implements IImagenService  {
    async modificar(id: number, imagen: Imagen) {
  

        let respuesta: any;
        const connection = getConnection();
            const queryRunner = connection.createQueryRunner();

            // establish real database connection using our new query runner
            await queryRunner.connect();

            // lets now open a new transaction:
            await queryRunner.startTransaction();
            try {
                await getRepository(Imagen)
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
                respuesta = true;
            } catch (err) {
            
                // since we have errors let's rollback changes we made
                await queryRunner.rollbackTransaction();
                respuesta = err;
                console.log(err);
            
            } finally {
            
                // you need to release query runner which is manually created:
                await queryRunner.release();
            }

            return respuesta;
    }
    async buscar(id: number) {
        const imagen = await  getRepository(Imagen).findOne(id);
        return imagen;
    }
  
    
   
}
  
export { ImagenService };  