export interface INotificacionSolicitanteService {  
    listar(id_solicitante: number): any;
    contarNoLeidas(id_empleador: number): any;
    leerNotificacion(id_notificacion: number): any;
} 