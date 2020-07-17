import express from 'express';
import { SERVER_PORT } from '../global/environments';
//import socketIO from 'socket.io';
import http from 'http';
// import * as socket from '../sockets/socket';
// 
// import socketioJwt from 'socketio-jwt';
// import {SEED}  from '../config/config';


// Inversify

import { interfaces, InversifyExpressServer, TYPE } from 'inversify-express-utils';
import { myContainer } from '../config/inversify.config';
import bodyParser from 'body-parser';
import '../src/controllers/rol.controller';  
import '../src/controllers/administrador.controller';  
import '../src/controllers/login.controller'; 
import '../src/controllers/area-laboral.controller'; 
import '../src/controllers/profesion.controller'; 


export default class Server {

    private static _instance:Server;
    public server: InversifyExpressServer;  
    public port: number;    

//    public io: any;
    private httpServer: http.Server;
    


    private constructor() {
        this.server = new InversifyExpressServer(myContainer);
        this.port = SERVER_PORT; 

        this.server.setConfig((app) => {
            // add body parser
            app.use(bodyParser.urlencoded({
              extended: true
            }));
            app.use(bodyParser.json());
          });
        let app = this.server.build();
        this.httpServer =  http.createServer(app);
               
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