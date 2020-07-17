import { AreaLaboral } from '../entity/area-laboral';

export interface IAreaLaboralService {
    listar(desde: number): any;
    adicionar(area: AreaLaboral): any;
    modificar(id: number,area: AreaLaboral): any;
    eliminar(id: number):any;
    buscar(id: number): any;
} 