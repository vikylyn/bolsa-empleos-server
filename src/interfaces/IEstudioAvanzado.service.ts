import { EstudioAvanzado } from '../entity/estudio-avanzado';

export interface IEstudioAvanzadoService {
    listar(id: number, desde: number): any;
    adicionar(body: any): any;
    modificar(estudio: EstudioAvanzado,body: any): any;
    eliminar(id: number):any;
    buscar(id: number): any;
    contar(id_curriculum: number): any;
} 