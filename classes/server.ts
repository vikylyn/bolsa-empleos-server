import express from 'express';
import { SERVER_PORT } from '../global/environments';
//import socketIO from 'socket.io';
import http from 'http';
// import * as socket from '../sockets/socket';
// 
// import socketioJwt from 'socketio-jwt';
// import {SEED}  from '../config/config';

export default class Server {

    private static _instance:Server;
    public app: express.Application;
    public port: number;

//    public io: any;
    private httpServer: http.Server;


    private constructor() {
        this.app = express();
        this.port = SERVER_PORT;
        this.httpServer = new http.Server(this.app);
               
//        this.io =socketIO.listen(this.httpServer);
//        this.escucharSockets(); 
    }
    public static get instance() {
        return this._instance || (this._instance = new this());
    }

/*    escucharSockets() {
        // autentificacion del socket
        this.io.set('authorization', socketioJwt.authorize({
            secret: SEED,
            handshake: true
        }));
       
        // Escuchando eventos
        console.log('Escuchando conexiones');
        this.io.on('connection', (cliente: socketIO.Socket) => {
            console.log('Cliente conectado');
            //conectar cliente
        socket.conectarCliente( cliente, this.io );
        //configurar usuario
        socket.configurarUsuario(cliente, this.io)
        // Obtener usuarios activos
        socket.obtenerUsuario(cliente, this.io); 
        
        // Mensajes 
        socket.mensaje(cliente, this.io); 
            
        // Desconectar
        socket.desconectar( cliente, this.io);
        
        // logout 
        socket.salir(cliente,this.io);
           
        });
    }
*/

    start( callback: any ) {
        this.httpServer.listen( this.port, callback())
    }
 



}