export interface IReportesSolicitanteService {
    generarListadoSolicitantes(body: any):any;
    contarSolicitantes(body: any): any;

    generarListadoSolicitantesRechazados(body: any):any;
    generarListadoSolicitantesContratados(body: any):any;
} 