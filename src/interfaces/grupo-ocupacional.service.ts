export interface IGrupoOcupacionalService {
    listar(desde: number): any;
    listarTodas(): any; 
    adicionar(area: any): any;
    modificar(id: number,body: any): any;
    inhabilitar(id: number):any;
    habilitar(id: number):any;
    buscar(id: number): any;
    contar(): any;
    buscarPorNombre(nombre: string): any;
} 