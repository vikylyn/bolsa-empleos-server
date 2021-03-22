export interface IInformacionAppService {  
    buscar(id_informacion: number): any;
    modificar(id_informacion: number, body: any): any;
} 