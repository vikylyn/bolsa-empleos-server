import { Postulacion } from '../entity/postulacion';
export interface IPostulacionService {
    listarConsideradosPorIdVacante(id: number, desde: number): any;
    listarNoConsideradosPorIdVacante(id: number, desde: number): any;
    contarConsideradosPorIdVacante(id_vacante: number): any;
    contarNoConsideradosPorIdVacante(id_vacante: number): any;

    buscar(id: number): any;
    eliminar(postulacion: Postulacion):any;
    aceptarSolicitante(postulacion: Postulacion): any;
    aceptarRechazado(postulacion: Postulacion): any;
    rechazar(postulacion: Postulacion):any;
    confirmar(postulacion: Postulacion):any;

    postularSolicitante(body:any): any;
    favorito(id: number):any;
    quitarFavorito(id: number):any;
    listarFavoritos(id: number, desde: number): any;
    listarPendientesPorIdSolicitante(id: number,desde: number): any;
    listarConsideradosPorIdSolicitante(id: number,desde: number): any;
    buscarPorSolicitanteVacante(id_solicitante: number, id_vacante: number):any;


    contarPendientesPorIdSolicitante(id_solicitante: number): any;
    contarConsideradosPorIdSolicitante(id_solicitante: number): any;
    listarRechazadosPorIdVacante(id_vacante: number, desde: number): any;
    contarRechazadosPorIdVacante(id_vacante: number): any;
    listarRechazadosPorSolicitante(id: number,desde: number): any;
    contarRechazadosPorIdSolicitante(id_solicitante: number): any;


    busqueda(valor: string,id_empleador: number): any;

    invitarPostulacion(body:any): any;

} 