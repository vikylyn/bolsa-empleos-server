import { CurriculumIdioma } from '../entity/curriculum-idioma';

export interface ICurriculumIdiomaService {
    listar(id: number, desde: number): any;   
    adicionar(curriculum_idioma: CurriculumIdioma): any;
    modificar(id: number,curriculum_idioma: CurriculumIdioma): any;
    eliminar(id: number):any;
    buscar(id: number): any;  
    contar(id_curriculum: number): any;
}   