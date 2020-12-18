export interface INotificacionEmpleadorService {  
    listar(id_empleador: number): any;
    contarNoLeidas(id_empleador: number): any;
    leerNotificacion(id_notificacion: number): any;
    buscar(id_notificacion: number): any;
    eliminar(id_notificacion: number): any;

} 