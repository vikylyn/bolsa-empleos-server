import Server from "./classes/server";
import { SERVER_PORT } from "./global/environments";
import cors from 'cors';
import bodyParser from 'body-parser';


const server = Server.instance;

//bodyParser
server.app.use(bodyParser.urlencoded({extended:true}));
server.app.use(bodyParser.json());   

//Cors 
server.app.use( cors ( { origin: true , credentials: true}));




server.start( () => {
    console.log(`Servidor corriendo en el puerto ${SERVER_PORT}`)
})
   