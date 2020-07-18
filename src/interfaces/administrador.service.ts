

import { Administrador } from '../entity/administrador';


export interface IAdministradorService {
    listar(desde: number): any;
    adicionar(body:any): any;
    modificar(id: number,administrador: Administrador): any;
    eliminar(id: number):any;
    buscar(id: number): any;
    buscarPorCredencial(id: number): any;
} 