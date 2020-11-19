export class Usuario {
    public id: string;
    public idUsuario: number;
    public nombre: string;
    public rol: string;
    constructor(id: string){
        this.id = id;
        this.idUsuario = 0,
        this.nombre = 'sin-nombre';
        this.rol = 'sin-sala';
    }
}