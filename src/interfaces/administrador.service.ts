

import { Administrador } from '../entity/administrador';
import { Imagen } from '../entity/imagen';


export interface IAdministradorService {
    listar(desde: number): any;
    adicionar(body:any): any;
    modificar(id: Administrador,body: any): any;
    inhabilitar(id: number):any;
    habilitar(id: number):any;
    buscar(id: number): any;
    buscarPorCredencial(id: number): any;
    modificarImagen(id: number, imagen: Imagen): any;
    contar(): any;
    buscarPorNombre(nombre: string): any;
} 