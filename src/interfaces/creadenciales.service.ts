import { Credenciales } from '../entity/credenciales';
import { Rol } from '../entity/rol';

export interface ICredencialesService {
   
   // adicionar(credencial: Credenciales, role: Rol): any;
    modificar(id: number,credencial: Credenciales): any;
    eliminar(id: number):any;
    buscar(id: number): any;
    buscarCredenciales(email: string): any;    
} 