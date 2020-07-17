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
    modificar(id: number, credencial: Credenciales) {
        throw new Error("Method not implemented.");
    }
    eliminar(id: number) {
        throw new Error("Method not implemented.");
    }
    buscar(id: number) {
        throw new Error("Method not implemented.");  
    }
   
}
  
export { CredencialesRepository };  