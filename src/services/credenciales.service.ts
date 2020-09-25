import { ICredencialesService } from '../interfaces/creadenciales.service';
import { injectable } from 'inversify';
import { Credenciales } from '../entity/credenciales';
import { getRepository } from 'typeorm';
import bcrypt from 'bcryptjs';


@injectable()
class CredencialesService  implements ICredencialesService  {
    async buscarCredenciales(email: string) {
        const credenciales = await  getRepository(Credenciales).findOne({email: email});
        return credenciales;
    }
    async buscarEmailIguales(email: string, id_credencial: number) { 
        const credenciales = await  getRepository(Credenciales)  
        .createQueryBuilder("credenciales")
        .where("credenciales.email = :email and credenciales.id != :id", {email: email, id: id_credencial })  
        .getOne();
        console.log(credenciales);
        return credenciales; 
    }
 /*   adicionar(credencial: Credenciales, role: Rol) {
        const nuevoCredencial =   getRepository(Credenciales).create(
            {email: credencial.email, 
            password: credencial.password,
            rol: role}) 
            return nuevoCredencial; 
    }
*/
    async modificar(id: number, body: any) {
        const credencial_modificado = await getRepository(Credenciales)
        .createQueryBuilder()
        .update(Credenciales)
        .set({email: body.email, password: bcrypt.hashSync(body.password,10)})
        .where("id = :id", { id: id })
        .execute();
        return credencial_modificado;
    }
   
}
  
export { CredencialesService };  