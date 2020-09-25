import { CurriculumHabilidad } from '../entity/curriculum-habilidad';
export interface ICurriculumHabilidadService {
    listar(id: number, desde: number): any;
    adicionar(body: any): any;
    modificar(id: number,body: any): any;
    eliminar(id: number):any;
    buscar(id: number): any;
    contar(id_curriculum: number): any;
} 