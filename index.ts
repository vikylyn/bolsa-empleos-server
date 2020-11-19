import 'reflect-metadata';
import Server from "./src/classes/server";
import { SERVER_PORT } from "./src/global/environments";
import {createConnection} from 'typeorm'

const server = Server.instance;

createConnection().then(connection => {
    console.log('Conectado a la base de datos');
}).catch(error => console.log(error)); 

server.start( () => {
    console.log(`Servidor corriendo en el puerto ${SERVER_PORT}`)
})
   