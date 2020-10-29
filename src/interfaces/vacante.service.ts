import { Vacante } from '../entity/vacante';


export interface IVacanteService {
    listar(id: number, desde: number): any;
    adicionar(body: any): any;  
    modificar(id: number,vacante: Vacante): any;  
    inhabilitar(id: number):any;
    buscar(id: number): any;
    // solicitantes
    filtrarVacantes(body: any, desde: number):any;
    contar(id_empleador: number): any;
} 