import { Postulacion } from '../entity/postulacion';
import { Contratacion } from '../entity/contratacion';
export interface IContratacionService {
    aceptarSolicitante(postulacion: Postulacion): any;
    desvincularSolicitante(contratacion: Contratacion): any;
    buscar(id: number): any;
    listarPorIdVacante(id: number, desde: number): any;
    contarPorIdVacante(id: number): any;

    listarPorIdSolicitante(id: number, desde: number): any;
    eliminar(contratacion: Contratacion): any;
    rechazar(postulacion: Postulacion): any;
    ocultar(contratacion: Contratacion): any;

    buscarPorSolicitanteVacante(id_solicitante: number, id_vacante: number):any;

 
    contarPorIdSolicitante(id_solicitante: number): any;

    busqueda(valor: string,id_empleador: number): any;

    listarPorIdEmpleador(id: number, desde: number): any;
    contarPorIdEmpleador(id_empleador: number): any;


} 