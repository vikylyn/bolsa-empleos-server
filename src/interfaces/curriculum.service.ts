import { Curriculum } from '../entity/curriculum';


export interface ICurriculumService {
    listar(desde: number): any;
    adicionar(curriculum: Curriculum): any;
    modificar(id: number,curriculum: Curriculum): any;
    buscarPorId(id: number): any;
    buscarPorIdSolicitante(id: number): any;

} 