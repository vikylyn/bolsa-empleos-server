import { Profesion } from '../entity/profesion';
export interface IProfesionService {  
    listar(desde: number): any;
    adicionar(profesion: Profesion): any;
    modificar(id: number,profesion: Profesion): any;
    eliminar(id: number):any;
    buscar(id: number): any;
} 