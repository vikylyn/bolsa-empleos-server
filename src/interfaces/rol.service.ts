import { Rol } from "../entity/rol";

export interface IRolService {
    listar(): any;
    buscar(id: number): any;
} 