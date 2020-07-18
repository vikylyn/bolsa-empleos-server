import { Solicitante } from '../entity/solicitante';
import { Credenciales } from '../entity/credenciales';


export interface ISolicitanteService {
    listar(desde: number): any;
    adicionar(body:any): any;
    modificar(id: number,solicitante: Solicitante): any;
    eliminar(id: number):any;
    buscar(id: number): any;
    buscarPorCredencial(id: number): any;
    // Ver si poner estos en vacantes
    activar_ocupacion(id: number):any;
    desactivar_ocupacion(id: number):any;

} 