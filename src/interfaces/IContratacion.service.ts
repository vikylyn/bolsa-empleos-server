import { Contratacion } from '../entity/contratacion';
export interface IContratacionService {
    desvincularSolicitante(contratacion: Contratacion): any;
    buscar(id: number): any;
    listarPorIdVacante(id: number, desde: number): any;
    contarPorIdVacante(id: number): any;
    listarPorIdSolicitante(id: number, desde: number): any;
    eliminar(contratacion: Contratacion): any;
    ocultar(contratacion: Contratacion): any;
    buscarPorSolicitanteVacante(id_solicitante: number, id_vacante: number):any;
    contarPorIdSolicitante(id_solicitante: number): any;
    busquedaEmpleador(valor: string,id_empleador: number): any;
    busquedaSolicitante(valor: string,id_solicitante: number): any;
    listarPorIdEmpleador(id: number, desde: number): any;
    contarPorIdEmpleador(id_empleador: number): any;


} 