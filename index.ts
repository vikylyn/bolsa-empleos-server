import 'reflect-metadata';
import Server from "./classes/server";
import { SERVER_PORT } from "./global/environments";
import cors from 'cors';
import bodyParser from 'body-parser';
import {createConnection} from 'typeorm'
  
const server = Server.instance;

createConnection().then(connection => {
    console.log('Conectado a la base de datos');
}).catch(error => console.log(error)); 

/*
//bodyParser
server.server.use(bodyParser.urlencoded({extended:true}));
server.server.use(bodyParser.json());   

//Cors 
server.server.use( cors ( { origin: true , credentials: true}));

// rutas 
server.server.use('/rol',rol );

*/

server.start( () => {
    console.log(`Servidor corriendo en el puerto ${SERVER_PORT}`)
})
   