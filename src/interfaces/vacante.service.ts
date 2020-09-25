import { Vacante } from '../entity/vacante';


export interface IVacanteService {
    listar(id: number, desde: number): any;
    adicionar(vacante: Vacante): any;  
    modificar(id: number,vacante: Vacante): any;  
    deshabilitar(id: number):any;
    buscar(id: number): any;
    // solicitantes
    filtrarVacantes(profesion_id: number,ciudad_id: number, fecha: string, tipo_contrato_id: number, desde: number):any;
} 