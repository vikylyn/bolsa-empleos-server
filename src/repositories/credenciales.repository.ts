import { ICredencialesService } from '../interfaces/creadenciales.service';
import { injectable } from 'inversify';
import { Credenciales } from '../entity/credenciales';
import { Rol } from '../entity/rol';
import { getRepository } from 'typeorm';


@injectable()
class CredencialesRepository  implements ICredencialesService  {
    async buscarCredenciales(email: string) {
        const credenciales = await  getRepository(Credenciales).findOne({email: email});
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
    async modificar(id: number, credenciales: Credenciales) {
        const credencial_modificado = await getRepository(Credenciales)
        .createQueryBuilder()
        .update(Credenciales)
        .set({email: credenciales.email, password: credenciales.password})
        .where("id = :id", { id: credenciales.id })
        .execute();
    }
    eliminar(id: number) {
        throw new Error("Method not implemented.");
    }
    buscar(id: number) {
        throw new Error("Method not implemented.");  
    }
   
}
  
export { CredencialesRepository };  