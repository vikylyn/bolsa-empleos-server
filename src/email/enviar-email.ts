import nodemailer from 'nodemailer'; 
const {google} = require ('googleapis'); 
import {clientId, clientSecret, url_redireccionamiento,refreshToken} from '../../global/environments'
import jwt from 'jsonwebtoken';
import { SEED } from '../../config/config';



const OAuth2 = google.auth.OAuth2;
const oauth2Client =  new  OAuth2 ( 
    clientId, 
    clientSecret, // Client Secret 
    url_redireccionamiento// URL de redireccionamiento 
);
    
oauth2Client.setCredentials ({ 
        refresh_token: refreshToken
}); 



const smtpTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
             type: "OAuth2",
             user: "fernandezvirgilio05@gmail.com", 
             clientId: clientId,
             clientSecret: clientSecret,
             refreshToken: refreshToken,
             accessToken: oauth2Client.getAccessToken()
        }
    });
    

export let sendEmailSolicitante = function(id: number,email: string) {
    let token = jwt.sign({ email }, SEED, {expiresIn: 86400 }); // expira 24horas
    const mailOptions = {
        from: "fernandezvirgilio05@gmail.com",
        to: email,
        subject: "Activar Cuenta de Solicitante de Empleo",
        generateTextFromHTML: true,
        html: `
        <a href="http://localhost:4200/solicitante/activacion/${id}?token=${token}">Activar Cuenta</a>
            `
    };
    
    smtpTransport.sendMail(mailOptions, (error:any, response: any) => {
        error ? console.log(error) : console.log(response);
        smtpTransport.close();
    });
    
}

export let sendEmailEmpleador = function(id: number,email: string) {
    let token = jwt.sign({ email }, SEED, {expiresIn: 86400 }); // expira 24horas
    const mailOptions = {
        from: "fernandezvirgilio05@gmail.com",
        to: email,
        subject: "Activar cuenta de Empleador",
        generateTextFromHTML: true,
        html: `
        <a href="http://localhost:4200/empleador/activacion/${id}?token=${token}">Activar Cuenta</a>
            `
    };
    
    smtpTransport.sendMail(mailOptions, (error:any, response: any) => {
        error ? console.log(error) : console.log(response);
        smtpTransport.close();
    });
    
}


  
