export interface INotificacionSolicitanteService {  
    listar(id_solicitante: number): any;
    contarNoLeidas(id_empleador: number): any;
    leerNotificacion(id_notificacion: number): any;
    buscar(id_notificacion: number): any;
    buscarPorIdSolicitanteVacanteTipoNotificacion(id_solicitante: number, id_vacante: number, id_tipo_notificacion: number): any;
    eliminar(id_notificacion: number): any;

} 