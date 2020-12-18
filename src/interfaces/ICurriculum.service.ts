import { Curriculum } from '../entity/curriculum';


export interface ICurriculumService {
    listar(desde: number): any;
    adicionar(curriculum: Curriculum): any;
    modificar(id: number,curriculum: Curriculum): any;
    buscarPorId(id: number): any;
    buscarPorIdSolicitante(id: number): any;
    buscarPorIdSolicitanteCompleto(id: number): any;

    verificarSiExiste(id_solicitante: number): any;

} 