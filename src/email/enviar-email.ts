import nodemailer from 'nodemailer'; 
const {google} = require ('googleapis'); 
import {clientId, clientSecret, url_redireccionamiento,refreshToken} from '../global/environments'
import jwt from 'jsonwebtoken';
import { SEED } from '../config/config';
import { Administrador } from '../entity/administrador';
import { Empleador } from '../entity/empleador';
import { Solicitante } from '../entity/solicitante';
import { InformacionApp } from '../entity/informacionApp';



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
    

export let sendEmailSolicitante = function(solicitante: Solicitante,informacionApp: InformacionApp) {
    let token = jwt.sign({ usuario: solicitante }, SEED, {expiresIn: 86400 }); // expira 24horas
    let html = `<table style="margin:auto;border:#242a33 1px solid;border-collapse:collapse;font-size:3px;font-family:Arial,Helvetica,sans-serif" width="432" cellspacing="0" cellpadding="0" border="0" bgcolor="#FFFFFF">
        <tbody> 
            <tr>
            <td colspan="2" bgcolor="#242a33"><div style="font-size:3px;font-family:Arial,Helvetica,sans-serif">|</div></td>
        </tr>
        <tr>
            <td width="326"><div style="font-size:14px;font-family:Arial,Helvetica,sans-serif;color:#002b55" align="center">
                    <strong>Activa tu cuenta</strong>
                </div></td>
        </tr>
        <tr>
            <td colspan="2" style="color:#242a33" bgcolor="#242a33"><div style="font-size:3px;font-family:Arial,Helvetica,sans-serif">|</div></td>
        </tr>
        <tr>
            <td colspan="2" bgcolor="#242a33"><div style="border-bottom:#242a33 1px solid">
                    <table width="430" cellspacing="0" cellpadding="0" border="0" bgcolor="#f2f2f2">
                        <tbody><tr>
                            <td width="30">&nbsp;</td>
                            <td width="370">
                                <div style="font-size:12px;font-family:Arial,Helvetica,sans-serif;color:#002b55">
                                    <br>
                                    <p><strong>Hola, ${solicitante.nombre} ${solicitante.apellidos}</strong>.</p>
                                    <p>Para poder ingresar al sitio web necesitas verificar tu correo haciendo clic en el botón de abajo.</p>
                                    
                                </div>
                                    
                            </td>
                            <td width="30">&nbsp;</td>
                        </tr>
                    </tbody></table>
                </div>
                <table width="430" cellspacing="0" cellpadding="0" border="0">
                    <tbody><tr>
                        <td width="30">&nbsp;</td>
                        <td width="370">
                            <div style="font-size:12px;font-family:Arial,Helvetica,sans-serif;color:#002b55">
                                <br><br>
                                <table style="border-top:#1168a2 8px solid;border-bottom:#1168a2 8px solid" width="170" cellspacing="0" cellpadding="0" border="0" bgcolor="#1168a2" align="center">
                                    <tbody><tr>
                                        <td width="170">
                                            <div style="font-size:12px;font-family:Arial,Helvetica,sans-serif;color:#ffffff" align="center">
                                                <a href="http://localhost:4200/solicitante/activacion/${solicitante.id}?token=${token}" style="text-decoration:none;color:#ffffff" target="_blank" ><strong>Activar Cuenta</strong></a>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody></table>
                                <br><br>
                            </div>
                        </td>
                        <td width="30">&nbsp;</td>
                    </tr>
                </tbody></table></td>
        </tr>
    </tbody></table>`;
    

    const mailOptions = {
        from: informacionApp.email,
        to: solicitante.credenciales.email,
        subject: "Activar Cuenta de Solicitante de Empleo",
        generateTextFromHTML: true,
        html: html
    };
    
    smtpTransport.sendMail(mailOptions, (error:any, response: any) => {
        error ? console.log(error) : console.log(response);
        smtpTransport.close();
    });
    
}
export let sendEmailRestablecerPasswordSolicitante = function(solicitante: Solicitante,informacionApp: InformacionApp) {
    let token = jwt.sign({ usuario: solicitante }, SEED, {expiresIn: 86400 }); // expira 24horas
    let html = `<table style="margin:auto;border:#242a33 1px solid;border-collapse:collapse;font-size:3px;font-family:Arial,Helvetica,sans-serif" width="432" cellspacing="0" cellpadding="0" border="0" bgcolor="#FFFFFF">
        <tbody> 
            <tr>
            <td colspan="2" bgcolor="#242a33"><div style="font-size:3px;font-family:Arial,Helvetica,sans-serif">|</div></td>
        </tr>
        <tr>
            <td width="326"><div style="font-size:14px;font-family:Arial,Helvetica,sans-serif;color:#002b55" align="center">
                    <strong>Restablece tu contraseña</strong>
                </div></td>
        </tr>
        <tr>
            <td colspan="2" style="color:#242a33" bgcolor="#242a33"><div style="font-size:3px;font-family:Arial,Helvetica,sans-serif">|</div></td>
        </tr>
        <tr>
            <td colspan="2" bgcolor="#242a33"><div style="border-bottom:#242a33 1px solid">
                    <table width="430" cellspacing="0" cellpadding="0" border="0" bgcolor="#f2f2f2">
                        <tbody><tr>
                            <td width="30">&nbsp;</td>
                            <td width="370">
                                <div style="font-size:12px;font-family:Arial,Helvetica,sans-serif;color:#002b55">
                                    <br>
                                    <p><strong>Hola, ${solicitante.nombre} ${solicitante.apellidos}</strong>.</p>
                                    <p>Si deseas restablecer tu contraseña haz clic en el botón de abajo. Si no deseas restablecerla no tienes de que preocuparte, puedes omitir esta notificación</p>  
                                </div>
                                    
                            </td>
                            <td width="30">&nbsp;</td>
                        </tr>
                    </tbody></table>
                </div>
                <table width="430" cellspacing="0" cellpadding="0" border="0">
                    <tbody><tr>
                        <td width="30">&nbsp;</td>
                        <td width="370">
                            <div style="font-size:12px;font-family:Arial,Helvetica,sans-serif;color:#002b55">
                                <br><br>
                                <table style="border-top:#1168a2 8px solid;border-bottom:#1168a2 8px solid" width="170" cellspacing="0" cellpadding="0" border="0" bgcolor="#1168a2" align="center">
                                    <tbody><tr>
                                        <td width="170">
                                            <div style="font-size:12px;font-family:Arial,Helvetica,sans-serif;color:#ffffff" align="center">
                                                <a href="http://localhost:4200/password/${solicitante.credenciales.id}?token=${token}"  style="text-decoration:none;color:#ffffff" target="_blank" ><strong>Restablecer contraseña</strong></a>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody></table>
                                <br><br>
                            </div>
                        </td>
                        <td width="30">&nbsp;</td>
                    </tr>
                </tbody></table></td>
        </tr>
    </tbody></table>`;
    const mailOptions = {
        from: informacionApp.email,
        to: solicitante.credenciales.email,
        subject: "Restablecer contraseña",
        generateTextFromHTML: true,
        html: html
    };
    
    smtpTransport.sendMail(mailOptions, (error:any, response: any) => {
        error ? console.log(error) : console.log(response);
        smtpTransport.close();
    });
    
}
export let sendEmailRestablecerPasswordAdministrador = function(administrador: Administrador,informacionApp: InformacionApp) {
    let token = jwt.sign({ usuario:administrador }, SEED, {expiresIn: 86400 }); // expira 24horas
    const mailOptions = {
        from: informacionApp.email,
        to: administrador.credenciales.email,
        subject: "Restablecer contraseña",
        generateTextFromHTML: true,
        html: `
        <table style="margin:auto;border:#242a33 1px solid;border-collapse:collapse;font-size:3px;font-family:Arial,Helvetica,sans-serif" width="432" cellspacing="0" cellpadding="0" border="0" bgcolor="#FFFFFF">
            <tbody> 
                <tr>
                <td colspan="2" bgcolor="#242a33"><div style="font-size:3px;font-family:Arial,Helvetica,sans-serif">|</div></td>
            </tr>
            <tr>
                <td width="326"><div style="font-size:14px;font-family:Arial,Helvetica,sans-serif;color:#002b55" align="center">
                        <strong>Restablece tu contraseña</strong>
                    </div></td>
            </tr>
            <tr>
                <td colspan="2" style="color:#242a33" bgcolor="#242a33"><div style="font-size:3px;font-family:Arial,Helvetica,sans-serif">|</div></td>
            </tr>
            <tr>
                <td colspan="2" bgcolor="#242a33"><div style="border-bottom:#242a33 1px solid">
                        <table width="430" cellspacing="0" cellpadding="0" border="0" bgcolor="#f2f2f2">
                            <tbody><tr>
                                <td width="30">&nbsp;</td>
                                <td width="370">
                                    <div style="font-size:12px;font-family:Arial,Helvetica,sans-serif;color:#002b55">
                                        <br>
                                        <p><strong>Hola, ${administrador.nombre} ${administrador.apellidos}</strong>.</p>
                                        <p>Si deseas restablecer tu contraseña haz clic en el botón de abajo. Si no deseas restablecerla no tienes de que preocuparte, puedes omitir esta notificacion</p>
                                        
                                    </div>
                                        
                                </td>
                                <td width="30">&nbsp;</td>
                            </tr>
                        </tbody></table>
                    </div>
                    <table width="430" cellspacing="0" cellpadding="0" border="0">
                        <tbody><tr>
                            <td width="30">&nbsp;</td>
                            <td width="370">
                                <div style="font-size:12px;font-family:Arial,Helvetica,sans-serif;color:#002b55">
                                    <br><br>
                                    <table style="border-top:#1168a2 8px solid;border-bottom:#1168a2 8px solid" width="170" cellspacing="0" cellpadding="0" border="0" bgcolor="#1168a2" align="center">
                                        <tbody><tr>
                                            <td width="170">
                                                <div style="font-size:12px;font-family:Arial,Helvetica,sans-serif;color:#ffffff" align="center">
                                                    <a href="http://localhost:4200/password/${administrador.credenciales.id}?token=${token}" style="text-decoration:none;color:#ffffff" target="_blank" ><strong>Restablecer contraseña</strong></a>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody></table>
                                    <br><br>
                                </div>
                            </td>
                            <td width="30">&nbsp;</td>
                        </tr>
                    </tbody></table></td>
            </tr>
        </tbody></table>`
    };
    
    smtpTransport.sendMail(mailOptions, (error:any, response: any) => {
        error ? console.log(error) : console.log(response);
        smtpTransport.close();
    });
    
}
export let sendEmailEmpleador = function(empleador: Empleador,informacionApp: InformacionApp) {
    let token = jwt.sign({ usuario: empleador }, SEED, {expiresIn: 86400 }); // expira 24horas
    let html = `<table style="margin:auto;border:#242a33 1px solid;border-collapse:collapse;font-size:3px;font-family:Arial,Helvetica,sans-serif" width="432" cellspacing="0" cellpadding="0" border="0" bgcolor="#FFFFFF">
        <tbody> 
            <tr>
            <td colspan="2" bgcolor="#242a33"><div style="font-size:3px;font-family:Arial,Helvetica,sans-serif">|</div></td>
        </tr>
        <tr>
            <td width="326"><div style="font-size:14px;font-family:Arial,Helvetica,sans-serif;color:#002b55" align="center">
                    <strong>Activa tu cuenta</strong>
                </div></td>
        </tr>
        <tr>
            <td colspan="2" style="color:#242a33" bgcolor="#242a33"><div style="font-size:3px;font-family:Arial,Helvetica,sans-serif">|</div></td>
        </tr>
        <tr>
            <td colspan="2" bgcolor="#242a33"><div style="border-bottom:#242a33 1px solid">
                    <table width="430" cellspacing="0" cellpadding="0" border="0" bgcolor="#f2f2f2">
                        <tbody><tr>
                            <td width="30">&nbsp;</td>
                            <td width="370">
                                <div style="font-size:12px;font-family:Arial,Helvetica,sans-serif;color:#002b55">
                                    <br>
                                    <p><strong>Hola, ${empleador.nombre} ${empleador.apellidos}</strong>.</p>
                                    <p>Para poder ingresar al sitio web necesitas verificar tu correo haciendo clic en el botón de abajo.</p>
                                    
                                </div>
                                    
                            </td>
                            <td width="30">&nbsp;</td>
                        </tr>
                    </tbody></table>
                </div>
                <table width="430" cellspacing="0" cellpadding="0" border="0">
                    <tbody><tr>
                        <td width="30">&nbsp;</td>
                        <td width="370">
                            <div style="font-size:12px;font-family:Arial,Helvetica,sans-serif;color:#002b55">
                                <br><br>
                                <table style="border-top:#1168a2 8px solid;border-bottom:#1168a2 8px solid" width="170" cellspacing="0" cellpadding="0" border="0" bgcolor="#1168a2" align="center">
                                    <tbody><tr>
                                        <td width="170">
                                            <div style="font-size:12px;font-family:Arial,Helvetica,sans-serif;color:#ffffff" align="center">
                                                <a href="http://localhost:4200/empleador/activacion/${empleador.id}?token=${token}" style="text-decoration:none;color:#ffffff" target="_blank" ><strong>Activar Cuenta</strong></a>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody></table>
                                <br><br>
                            </div>
                        </td>
                        <td width="30">&nbsp;</td>
                    </tr>
                </tbody></table></td>
        </tr>
    </tbody></table>`;
   
    const mailOptions = {
        from: informacionApp.email,
        to: empleador.credenciales.email,
        subject: "Activar cuenta de Empleador",
        generateTextFromHTML: true,
        html: html
    };
    
    smtpTransport.sendMail(mailOptions, (error:any, response: any) => {
        error ? console.log(error) : console.log(response);
        smtpTransport.close();
    });
    
} 
export let sendEmailRestablecerPasswordEmpleador = function(empleador: Empleador,informacionApp: InformacionApp) {
    let token = jwt.sign({ usuario: empleador }, SEED, {expiresIn: 86400 }); // expira 24horas
    let html = `<table style="margin:auto;border:#242a33 1px solid;border-collapse:collapse;font-size:3px;font-family:Arial,Helvetica,sans-serif" width="432" cellspacing="0" cellpadding="0" border="0" bgcolor="#FFFFFF">
        <tbody> 
            <tr>
            <td colspan="2" bgcolor="#242a33"><div style="font-size:3px;font-family:Arial,Helvetica,sans-serif">|</div></td>
        </tr>
        <tr>
            <td width="326"><div style="font-size:14px;font-family:Arial,Helvetica,sans-serif;color:#002b55" align="center">
                    <strong>Restablece tu contraseña</strong>
                </div></td>
        </tr>
        <tr>
            <td colspan="2" style="color:#242a33" bgcolor="#242a33"><div style="font-size:3px;font-family:Arial,Helvetica,sans-serif">|</div></td>
        </tr>
        <tr>
            <td colspan="2" bgcolor="#242a33"><div style="border-bottom:#242a33 1px solid">
                    <table width="430" cellspacing="0" cellpadding="0" border="0" bgcolor="#f2f2f2">
                        <tbody><tr>
                            <td width="30">&nbsp;</td>
                            <td width="370">
                                <div style="font-size:12px;font-family:Arial,Helvetica,sans-serif;color:#002b55">
                                    <br>
                                    <p><strong>Hola, ${empleador.nombre} ${empleador.apellidos}</strong>.</p>
                                    <p>Si deseas restablecer tu contraseña haz clic en el botón de abajo. Si no deseas restablecerla no tienes de que preocuparte, puedes omitir esta notificacion</p>  
                                </div>
                                    
                            </td>
                            <td width="30">&nbsp;</td>
                        </tr>
                    </tbody></table>
                </div>
                <table width="430" cellspacing="0" cellpadding="0" border="0">
                    <tbody><tr>
                        <td width="30">&nbsp;</td>
                        <td width="370">
                            <div style="font-size:12px;font-family:Arial,Helvetica,sans-serif;color:#002b55">
                                <br><br>
                                <table style="border-top:#1168a2 8px solid;border-bottom:#1168a2 8px solid" width="170" cellspacing="0" cellpadding="0" border="0" bgcolor="#1168a2" align="center">
                                    <tbody><tr>
                                        <td width="170">
                                            <div style="font-size:12px;font-family:Arial,Helvetica,sans-serif;color:#ffffff" align="center">
                                                <a href="http://localhost:4200/password/${empleador.credenciales.id}?token=${token}"  style="text-decoration:none;color:#ffffff" target="_blank" ><strong>Restablecer contraseña</strong></a>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody></table>
                                <br><br>
                            </div>
                        </td>
                        <td width="30">&nbsp;</td>
                    </tr>
                </tbody></table></td>
        </tr>
    </tbody></table>`;
    

    const mailOptions = {
        from: informacionApp.email,
        to: empleador.credenciales.email,
        subject: "Restablecer Contraseña",
        generateTextFromHTML: true,
        html: html
    };
    
    smtpTransport.sendMail(mailOptions, (error:any, response: any) => {
        error ? console.log(error) : console.log(response);
        smtpTransport.close();
    });
    
}