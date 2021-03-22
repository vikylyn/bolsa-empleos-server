import { ExperienciaLaboral } from '../entity/experiencia-laboral';
export interface IExperienciaService {
    listar(id: number, desde: number): any;
    adicionar(body: any): any;
    modificar(experiencia: ExperienciaLaboral,body: any): any;
    eliminar(id: number):any;
    buscar(id: number): any;
    contar(id_curriculum: number): any;
}  