import { Vacante } from '../entity/vacante';


export interface IVacanteService {
    listarTodas(id: number, desde: number): any;
    listarHabilitadas(id: number, desde: number): any;
    listarInhabilitadas(id: number, desde: number): any;
    listarHabilitadasSinPaginacion(id: number): any;

    adicionar(body: any): any;  
    modificar(id: number,vacante: Vacante): any;  
    inhabilitar(id: number):any;
    habilitar(id: number):any;
    eliminarLogico(id: number):any;
    eliminarFisico(id: number):any;
    buscar(id: number): any;
    // solicitantes
    filtrarVacantesAscendente(body: any, desde: number):any;
    filtrarVacantesDescendente(body: any, desde: number):any;
    contarFiltrados(body: any):any;
    contarTodas(id_empleador: number): any;
    contarHabilitadas(id_empleador: number): any;
    contarInhabilitadas(id_empleador: number): any;


    busqueda(valor: string,id_empleador: number): any;


} 