

export interface IAreaLaboralService {
    listar(desde: number): any;
    listarTodas(): any; 
    adicionar(area: any): any;
    modificar(id: number,body: any): any;
    eliminar(id: number):any;
    buscar(id: number): any;
    contar(): any;
    buscarPorNombre(nombre: string): any;
} 