import { Profesion } from '../entity/profesion';
export interface IProfesionService {  
    listar(desde: number): any;
    listarTodas(): any;
    adicionar(body: any): any;
    modificar(id: number, body: any): any;
    eliminar(id: number):any;
    buscar(id: number): any;
    contar(): any;
    buscarPorNombre(nombre: string): any;
    filtrar(id_area: number, id_actividad: number, desde: number): any;
    contarFiltrados(id_area: number, id_actividad: number): any;

} 