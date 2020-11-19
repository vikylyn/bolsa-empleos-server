import express from 'express';
import { SERVER_PORT } from '../global/environments';
import http from 'http';
import cors from 'cors';

// socket.io
import socketIO from 'socket.io';

// import * as socket from '../sockets/socket';
// 
// import socketioJwt from 'socketio-jwt';
// import {SEED}  from '../config/config';

import * as socket from '../sockets/socket';

// Inversify

import {InversifyExpressServer} from 'inversify-express-utils';
import { myContainer } from '../config/inversify.config';
import bodyParser from 'body-parser';

import '../controllers/rol.controller';  
import '../controllers/administrador.controller';  
import '../controllers/login.controller'; 
import '../controllers/grupo-ocupacional.controller'; 
import '../controllers/ocupacion.controller'; 
import '../controllers/solicitante.controller'; 
import '../controllers/empleador.controller'; 
import '../controllers/curriculum.controller';
import '../controllers/referencias.controller'; 
import '../controllers/idioma.controller'; 
import '../controllers/curriculum-idioma.controller'; 
import '../controllers/upload.controller';
import '../controllers/estado-civil.controller';  
import '../controllers/habilidad.controller';  
import '../controllers/curriculum-habilidad.controller';  
import '../controllers/experiencia.controller';  
import '../controllers/grado-escolar.controller';  
import '../controllers/estudio-basico.controller'; 
import '../controllers/nivel-estudio.controller';
import '../controllers/estudio-avanzado.controller';
import '../controllers/empresa.controller';
import '../controllers/tipo-contrato.controller';
import '../controllers/rango-sueldo.controller';
import '../controllers/vacante.controller';
import '../controllers/horario.controller';
import '../controllers/postulacion.controller';
import '../controllers/contratacion.controller';
import '../controllers/ubicacion.controller';
import '../controllers/credenciales.controller';
import '../controllers/ocupacion-solicitante.controller'
import '../controllers/notificacion.controller'



export default class Server {

    private static _instance:Server;
    public server: InversifyExpressServer;  
    public port: number;    

    public io: socketIO.Server;
    private httpServer: http.Server;
     

    private constructor() {
        this.server = new InversifyExpressServer(myContainer);
        this.port = SERVER_PORT; 

        this.server.setConfig((app) => {
            app.use(bodyParser.urlencoded({
              extended: true
            }));
            app.use(bodyParser.json());
            app.use( cors ( { origin: true , credentials: true})); 
          });   
        let app = this.server.build(); 
        

        this.httpServer =  http.createServer(app);
               
        this.io = socketIO(this.httpServer); 
   //     this.io =socketIO.listen(this.httpServer);
 
        this.escucharSockets(); 
    }
    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    private  escucharSockets() {
        // autentificacion del socket
    /*    this.io.set('authorization', socketioJwt.authorize({
            secret: SEED,
            handshake: true
        }));
    */   
        // Escuchando eventos
        console.log('Escuchando conexiones');
        this.io.on('connection', (cliente: socketIO.Socket) => {
            console.log('Cliente conectado');

                //conectar cliente
               socket.conectarCliente( cliente, this.io );

               // Desconectar
               socket.desconectar( cliente, this.io);

               // mensaje --- cambiar para notificaciones
               socket.mensaje( cliente, this.io);

               // actualizar informacion de usuario en frontend
               socket.actualizarUsuario( cliente, this.io);

               // configurando solicitante
               socket.configuracionUsuario( cliente, this.io);

               //configurar usuario
            //   socket.configurarUsuario(cliente, this.io)
               // Obtener usuarios activos
            //   socket.obtenerUsuario(cliente, this.io); 

               // Mensajes 
            //   socket.mensaje(cliente, this.io); 



               // logout 
             //  socket.salir(cliente,this.io);
           
        });
    }


    start( callback: any ) {
        this.httpServer.listen( this.port, callback())
    }
 

 

}