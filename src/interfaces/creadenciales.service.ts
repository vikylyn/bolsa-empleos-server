import { Credenciales } from '../entity/credenciales';
import { Rol } from '../entity/rol';

export interface ICredencialesService {
   
   // adicionar(credencial: Credenciales, role: Rol): any; 
    modificar(id: number,credencial: Credenciales): any;
    buscarCredenciales(email: string): any; 
    buscarEmailIguales(email: string, id_credencial: number): any;   
} 