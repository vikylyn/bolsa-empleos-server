import 'reflect-metadata';
import Server from "./classes/server";
import { SERVER_PORT } from "./global/environments";
import cors from 'cors';
import bodyParser from 'body-parser';
import {createConnection} from 'typeorm'
 
import rol from './src/routes/rol.routes';
  
const server = Server.instance;

createConnection().then(connection => {
    console.log('Conectado a la base de datos');
}).catch(error => console.log(error)); 


//bodyParser
server.app.use(bodyParser.urlencoded({extended:true}));
server.app.use(bodyParser.json());   

//Cors 
server.app.use( cors ( { origin: true , credentials: true}));

// rutas 
server.app.use('/rol',rol );



server.start( () => {
    console.log(`Servidor corriendo en el puerto ${SERVER_PORT}`)
})
   