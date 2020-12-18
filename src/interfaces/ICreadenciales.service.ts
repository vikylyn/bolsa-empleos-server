import { Credenciales } from '../entity/credenciales';
import { Rol } from '../entity/rol';

export interface ICredencialesService {
   
   // adicionar(credencial: Credenciales, role: Rol): any; 
    modificar(id: number,password: string): any;
    buscarCredenciales(email: string): any; 
    buscarPorId(id: number): any; 
    buscarEmailIguales(email: string, id_credencial: number): any;   
} 