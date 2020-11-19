import {Socket} from 'socket.io'
import socketIO from 'socket.io';
import { Solicitante } from '../entity/solicitante';
import { UsuariosLista } from '../classes/usuarios-lista';
import { Usuario } from '../classes/usuario';

export const usuariosConectados = new UsuariosLista();

export const conectarCliente = async ( cliente: Socket, io: socketIO.Server) => {
    const usuario = new Usuario( cliente.id);
    usuariosConectados.agregar(usuario);
  //  io.emit('usuarios-activos'),usuariosConectados.getLista();
    console.log('usuario conectado adicionado a la lista de conectados');
  //  console.log(usuariosConectados);
 
}

export const desconectar = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('disconnect', async () => {
        cliente.disconnect();
        usuariosConectados.borrarUsuario(cliente.id);
        console.log('Cliente desconectado');
        console.log(usuariosConectados.getLista());
    });
}

export const mensaje = (cliente:Socket, io: socketIO.Server) => {
    cliente.on('mensaje', (payload: {habilidad: string}) => {
        console.log('mensaje recibido', payload);
        io.emit('notificacion-solicitante',{item: 'otra notificacion'})
    });
}

export const configuracionUsuario= (cliente:Socket, io: socketIO.Server) => {
    cliente.on('configurar-usuario', (payload: { idUsuario: number, nombre:string, rol: string}, callback: Function )=>{
        usuariosConectados.actualizarNombre( cliente.id,payload.idUsuario, payload.nombre, payload.rol);
        console.log(usuariosConectados.getLista());
        callback({ 
          ok:true,
          mensaje: `Usuario ${payload.nombre} configurado`
        });
       // io.emit('mensaje-nuevo', payload); 
    })

}

export const actualizarUsuario = (cliente:Socket, io: socketIO.Server) => {
  cliente.on('actualizar-usuario', (payload: {habilidad: string}) => {
      io.in(cliente.id).emit('actualizando-usuario');
  });
}