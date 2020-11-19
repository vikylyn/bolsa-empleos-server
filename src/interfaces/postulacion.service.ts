import { Postulacion } from '../entity/postulacion';
export interface IPostulacionService {
    listarPorIdVacante(id: number, desde: number): any;
    buscar(id: number): any;
    eliminar(id: number):any;
    aceptarSolicitante(postulacion: Postulacion): any;
    rechazar(postulacion: Postulacion):any;
    confirmar(postulacion: Postulacion):any;

    postularSolicitante(body:any): any;
    favorito(id: number):any;
    quitarFavorito(id: number):any;
    listarFavoritos(id: number, desde: number): any;
    listarPorSolicitante(id: number,desde: number): any;
    buscarPorSolicitanteVacante(id_solicitante: number, id_vacante: number):any;


    contarPorIdSolicitante(id_solicitante: number): any;
    contarPorIdVacante(id_vacante: number): any;

    busqueda(valor: string,id_empleador: number): any;


} 