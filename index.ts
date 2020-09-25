import 'reflect-metadata';
import Server from "./classes/server";
import { SERVER_PORT } from "./global/environments";
import {createConnection} from 'typeorm'

const server = Server.instance;



/*
const nodemailer = require ("nodemailer"); 
const {google} = require ("googleapis"); 
const OAuth2 = google.auth.OAuth2;

const oauth2Client =  new  OAuth2 ( 
    "1031098753843-7sji7636htcig585pjud23194m1oig6n.apps.googleusercontent.com", 
    "FFTnQPOoSjfUuP-rOlU4uLsW", // Client Secret 
    "https://developers.google.com/oauthplayground "// URL de redireccionamiento 
);

oauth2Client . setCredentials ({ 
    refresh_token: "1//04jiAFojcUJgUCgYIARAAGAQSNwF-L9IrcQSjHdEQdKiFV6IAFC0bT0GZO7telu-hv_77RxGDii9S257tEFHrKQzfoH5ZcvKvRaw" 
}); 
const accessToken = oauth2Client.getAccessToken ()

const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
         type: "OAuth2",
         user: "fernandezvirgilio05@gmail.com", 
         clientId: "1031098753843-7sji7636htcig585pjud23194m1oig6n.apps.googleusercontent.com",
         clientSecret: "FFTnQPOoSjfUuP-rOlU4uLsW",
         refreshToken: "1//04jiAFojcUJgUCgYIARAAGAQSNwF-L9IrcQSjHdEQdKiFV6IAFC0bT0GZO7telu-hv_77RxGDii9S257tEFHrKQzfoH5ZcvKvRaw",
         accessToken: accessToken
    }
});

const mailOptions = {
    from: "fernandezvirgilio05@gmail.com",
    to: "virgiliofer3@gmail.com",
    subject: "Node.js Email with Secure OAuth",
    generateTextFromHTML: true,
    html: "<b>test</b>"
};

smtpTransport.sendMail(mailOptions, (error:any, response: any) => {
    error ? console.log(error) : console.log(response);
    smtpTransport.close();
});
*/
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
   