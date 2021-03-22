export interface INotificacionSolicitanteService {  
    listar(id_solicitante: number): any;
    contarNoLeidas(id_solicitante: number): any;
    leerNotificacion(id_notificacion: number): any;
    buscar(id_notificacion: number): any;
    buscarPorIdSolicitanteVacanteTipoNotificacion(id_solicitante: number, id_vacante: number, id_tipo_notificacion: number): any;
    eliminar(id_notificacion: number): any;

    listarConPaginacion(id_solicitante: number,desde: number): any;
    contarTodas(id_solicitante: number): any;

} 