import express from 'express';
import { SERVER_PORT } from '../global/environments';
//import socketIO from 'socket.io';
import http from 'http';
import cors from 'cors';

//import fileUpload from 'express-fileupload';
import path from 'path';

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
import '../src/controllers/grupo-ocupacional.controller'; 
import '../src/controllers/ocupacion.controller'; 
import '../src/controllers/solicitante.controller'; 
import '../src/controllers/empleador.controller'; 
import '../src/controllers/curriculum.controller';
import '../src/controllers/referencias.controller'; 
import '../src/controllers/idioma.controller'; 
import '../src/controllers/curriculum-idioma.controller'; 
import '../src/controllers/upload.controller';
import '../src/controllers/estado-civil.controller';  
import '../src/controllers/habilidad.controller';  
import '../src/controllers/curriculum-habilidad.controller';  
import '../src/controllers/experiencia.controller';  
import '../src/controllers/grado-escolar.controller';  
import '../src/controllers/estudio-basico.controller'; 
import '../src/controllers/nivel-estudio.controller';
import '../src/controllers/estudio-avanzado.controller';
import '../src/controllers/empresa.controller';
import '../src/controllers/tipo-contrato.controller';
import '../src/controllers/rango-sueldo.controller';
import '../src/controllers/vacante.controller';
import '../src/controllers/horario.controller';
import '../src/controllers/postulacion.controller';
import '../src/controllers/contratacion.controller';
import '../src/controllers/ubicacion.controller';
import '../src/controllers/credenciales.controller';
import '../src/controllers/ocupacion-solicitante.controller'



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
            app.use( '/upload',express.static(path.resolve('imagenes')));
            app.use( cors ( { origin: true , credentials: true}));
           // app.use(express.static(path.resolve(__dirname, '../src/uploads')));
           // app.use(upload.single('image')); 
         
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