import { Postulacion } from '../entity/postulacion';
import { Contratacion } from '../entity/contratacion';
export interface IContratacionService {
    aceptarSolicitante(postulacion: Postulacion): any;
    confirmarContrato(postulacion: Postulacion):any;
    desvincularSolicitante(contratacion: Contratacion): any;
    buscar(id: number): any;
    listar(id: number, desde: number): any;
    listarConfirmados(id: number, desde: number): any;
    eliminar(contratacion: Contratacion): any;
    rechazar(postulacion: Postulacion): any;
    buscarPorSolicitanteVacante(id_solicitante: number, id_vacante: number):any;
} 