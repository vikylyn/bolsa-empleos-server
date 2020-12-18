import { Imagen } from '../entity/imagen';

export interface IImagenService {
    modificar(id: number,imagen: Imagen): any;
    buscar(id: number): any;
} 