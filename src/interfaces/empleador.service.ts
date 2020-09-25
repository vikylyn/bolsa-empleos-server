import { Empleador } from '../entity/empleador';
import { Imagen } from '../entity/imagen';

export interface IEmpleadorService {
    listar(desde: number): any;
    adicionarEmpleador(body: any): any;
    adicionarEmpleadorEmpresa(body: any): any;
    modificar(empleador: Empleador,body: any): any;
    modificarImagen(id: number, imagen: Imagen): any;
    eliminar(id: number):any;
    buscar(id: number): any;
    buscarPorCredencial(id: number): any;
    //
    habilitar(id: number):any;

} 