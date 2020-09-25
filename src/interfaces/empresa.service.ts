import { Imagen } from '../entity/imagen';
export interface IEmpresaService {
    listar(desde: number): any;
    modificar(id: number,body: any): any;
    modificarImagen(id: number, imagen: Imagen): any;
    buscar(id: number): any;
    buscarPorIdEmpleador(id_empleador: number): any;

} 