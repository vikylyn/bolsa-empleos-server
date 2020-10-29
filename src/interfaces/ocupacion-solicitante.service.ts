export interface IOcupacionSolicitanteService {  
    listar(id_solicitante: number, desde: number): any;
    adicionar(body: any): any;
    eliminar(id: number):any;
    contar(id_solicitante: number): any;
    habilitar(id: number): any;
} 