import { Postulacion } from '../entity/postulacion';
export interface IPostulacionService {
    listar(id: number, desde: number): any;
    buscar(id: number): any;
 //   aceptarSolicitante(id: number): any;  
    eliminar(id: number):any;
    postularSolicitante(postulacion: Postulacion): any;
    favorito(id: number):any;
    quitarFavorito(id: number):any;
    listarFavoritos(id: number, desde: number): any;
    listarPorSolicitante(id: number,desde: number): any;
    buscarPorSolicitanteVacante(id_solicitante: number, id_vacante: number):any;

} 