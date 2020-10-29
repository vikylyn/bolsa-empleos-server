
export interface IOcupacionService {  
    listar(desde: number): any;
    listarTodas(): any;
    adicionar(body: any): any;
    modificar(id: number, body: any): any;
    eliminar(id: number):any;
    buscar(id: number): any;
    contar(): any;
    buscarPorNombre(nombre: string): any;
    filtrar(id_area: number, desde: number): any;
    contarFiltrados(id_area: number): any;

    listarNoAsignadosSolicitante(id_solicitante: number):any;

} 