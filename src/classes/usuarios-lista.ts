
import { Usuario } from "./usuario";


export class UsuariosLista {
    private lista: Usuario[] = [];

    constructor(){

    }

    public agregar( usuario: Usuario) {
        this.lista.push(usuario);
        console.log(this.lista);
        return usuario;
    }

    public actualizarNombre ( id:string,idUsuario:number, nombre:string, rol: string) {
        for (let usuario of this.lista ) {
            if ( usuario.id === id ){
                usuario.nombre = nombre;
                usuario.idUsuario = idUsuario;
                usuario.rol = rol;
                break;
            } 
        }
        console.log('********actualizando usuario******');
    }

    // obtener lista de usuarios
    public getLista(){
        return this.lista.filter( usuario => usuario.nombre !== 'sin-nombre');
    }

    public getUsuario( id: string ){
        return this.lista.find( usuario => usuario.id == id)
    }

    public getUsuarioByIdAndRol( id: number, rol: string ){
        const usuario = this.lista.find( usuario => usuario.idUsuario === id && usuario.rol === rol);
        if(usuario){
            return usuario.id
        }else {
            return null;
        }
    }
 
    // borrar Usuario
    public borrarUsuario ( id: string){ 
        const tempUsuario = this.getUsuario(id);
        this.lista = this.lista.filter( usuario => usuario.id !== id);
        return tempUsuario;
    }
}