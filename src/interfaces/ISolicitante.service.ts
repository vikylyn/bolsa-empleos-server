import { Solicitante } from '../entity/solicitante';
import { Imagen } from '../entity/imagen';


export interface ISolicitanteService {
    filtrarDescendente(body: any, desde: number): any;
    filtrarAscendente(body: any, desde: number): any;
    contarFiltrados(body: any):any;
    
    adicionar(body:any): any;
    modificar(solicitante: Solicitante, body: any): any;
    eliminar(id: number):any;
    buscar(id: number): any;
    buscarPorCredencial(id: number): any;
    modificarImagen(id: number, imagen: Imagen): any;
    // Ver si poner estos en vacantes
    activar_ocupacion(id: number):any;
    desactivar_ocupacion(id: number):any;
    habilitar(id: number):any;

} 