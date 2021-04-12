import * as express from "express";
import { interfaces, controller, httpPost} from 'inversify-express-utils';
import { inject } from "inversify";
import { TYPES } from "../config/types";
import verificaToken from '../middlewares/verificar-token';
import { Solicitante } from '../entity/solicitante';
import { IReportesSolicitanteService } from '../interfaces/IReportes-solicitante.service';
import { body } from 'express-validator';
import validarCampos from '../middlewares/administrador/validar-campos';
import { IOcupacionService } from '../interfaces/IOcupacion.service';
import { Ocupacion } from '../entity/ocupacion';
import { Empleador } from '../entity/empleador';
import { Vacante } from '../entity/vacante';
import { Contratacion } from '../entity/contratacion';
import { IReportesEmpleadorService } from '../interfaces/IReportes-empleador.service';
import { IReportesVacanteService } from '../interfaces/IReportes-vacante.service';
import { IReportesContratacionService } from '../interfaces/IReportes-contratacion.service';
import { Empresa } from '../entity/empresa';
import { IReportePostulacionesService } from '../interfaces/IReporte-postulaciones.service';
import { Postulacion } from '../entity/postulacion';
 
@controller("/reportes")    
export class ReportesController implements interfaces.Controller {  
 
    constructor( @inject(TYPES.IReportesSolicitanteService) private reporteSolicitanteService: IReportesSolicitanteService,
                 @inject(TYPES.IReportesEmpleadorService) private reporteEmpleadorService: IReportesEmpleadorService,
                 @inject(TYPES.IReportesVacanteService) private reporteVacanteService: IReportesVacanteService,
                 @inject(TYPES.IReportePostulacionesService) private reportePostulacionesService: IReportePostulacionesService,
                 @inject(TYPES.IReportesContratacionService) private reporteContratacionService: IReportesContratacionService,
                 @inject(TYPES.IOcupacionService) private ocupacionService: IOcupacionService ) {} 

    @httpPost("/empleador",verificaToken, 
    body('id_ciudad','El id de la ciudad es oblidatorio').not().isEmpty(),
    body('empresa','El valor true o false es obligatorio').not().isEmpty(),
    body('fecha_inicio','La fecha de inicio es obligatoria').not().isEmpty(),
    body('fecha_fin','la fecha de finalizacion es obligatoria').not().isEmpty(),
    body('habilitado','El valor de todos, habilitado o inhabilitado es obligatorio').not().isEmpty(),
    validarCampos)
    private async generarListadoEmpleador(
            req: express.Request, 
            res: express.Response, 
            next: express.NextFunction) {
        try {
            let empleadores: Empleador [] = await this.reporteEmpleadorService.generarListadoEmpleadores(req.body);
            let total: number = await this.reporteEmpleadorService.contarEmpleadores(req.body);

            return res.status(200).json({
                ok: true,
                empleadores,
                total
            });
        } catch (error) {
            console.log(error);
        }

    }
    @httpPost("/empresa",verificaToken, 
    body('id_ciudad','El id de la ciudad es oblidatorio').not().isEmpty(),
    body('fecha_inicio','La fecha de inicio es obligatoria').not().isEmpty(),
    body('fecha_fin','la fecha de finalizacion es obligatoria').not().isEmpty(),
    body('habilitado','El valor de todos, habilitado o inhabilitado es obligatorio').not().isEmpty(),
    validarCampos)
    private async generarListadoEmpresas(
            req: express.Request, 
            res: express.Response, 
            next: express.NextFunction) {
        try {
            let empresas: Empresa [] = await this.reporteEmpleadorService.generarListadoEmpresas(req.body);
            let total: number = await this.reporteEmpleadorService.contarEmpresas(req.body);

            return res.status(200).json({
                ok: true,
                empresas,
                total
            });
        } catch (error) {
            console.log(error);
        }

    } 

    @httpPost("/solicitante",verificaToken, 
        body('id_ciudad','El id de la ciudad es oblidatorio').not().isEmpty(),
        body('id_ocupacion','El id de la ocupacion es obligatorio').not().isEmpty(),
        body('fecha_inicio','La fecha de inicio es obligatoria').not().isEmpty(),
        body('fecha_fin','la fecha de finalizacion es obligatoria').not().isEmpty(),
        body('habilitado','El valor de todos, habilitado o inhabilitado es obligatorio').not().isEmpty(),
        validarCampos)
    private async generarListadoSolicitante(
            req: express.Request, 
            res: express.Response, 
            next: express.NextFunction) {
        let solicitantes: Solicitante [] = await this.reporteSolicitanteService.generarListadoSolicitantes(req.body);
        let ocupacion: Ocupacion = await this.ocupacionService.buscar(req.body.id_ocupacion);
        let total: number = await this.reporteSolicitanteService.contarSolicitantes(req.body);
        return res.status(200).json({
            ok: true,
            solicitantes, 
            ocupacion,
            total
        });
    }
    @httpPost("/vacante",verificaToken, 
    body('id_ciudad','El id de la ciudad es oblidatorio').not().isEmpty(),
    body('id_ocupacion','El id de la ocupacion es obligatorio').not().isEmpty(),
    body('fecha_inicio','La fecha de inicio es obligatoria').not().isEmpty(),
    body('fecha_fin','la fecha de finalizacion es obligatoria').not().isEmpty(),
    body('habilitado','El valor de todos, habilitado o inhabilitado es obligatorio').not().isEmpty(),
    validarCampos)
    private async generarListadoVacantes(
            req: express.Request, 
            res: express.Response, 
            next: express.NextFunction) {
        let vacantes: Vacante [] = await this.reporteVacanteService.generarListadoVacantes(req.body);
        let total: number = await this.reporteVacanteService.contarVacantes(req.body);
        return res.status(200).json({
            ok: true,
            vacantes,
            total
        });
    }  
    @httpPost("/contratacion",verificaToken, 
    body('id_ciudad','El id de la ciudad es oblidatorio').not().isEmpty(),
    body('id_ocupacion','El id de la ocupacion es obligatorio').not().isEmpty(),
    body('fecha_inicio','La fecha de inicio es obligatoria').not().isEmpty(),
    body('fecha_fin','la fecha de finalizacion es obligatoria').not().isEmpty(),
    body('habilitado','El valor de todos, habilitado o inhabilitado es obligatorio').not().isEmpty(),
    validarCampos)
    private async generarListadoContrataciones(
            req: express.Request, 
            res: express.Response, 
            next: express.NextFunction) {
        let contrataciones: Contratacion [] = await this.reporteContratacionService.generarListadoContrataciones(req.body);
        let total: number = await this.reporteContratacionService.contarContrataciones(req.body);
        return res.status(200).json({
            ok: true,
            contrataciones,
            total
        });
    }  
   
    
    @httpPost("/postulaciones-rechazadas",verificaToken, 
        body('id_ciudad','El id de la ciudad es oblidatorio').not().isEmpty(),
        body('id_ocupacion','El id de la ocupacion es obligatorio').not().isEmpty(),
        body('fecha_inicio','La fecha de inicio es obligatoria').not().isEmpty(),
        body('fecha_fin','la fecha de finalizacion es obligatoria').not().isEmpty(),
        body('habilitado','El valor de todos, habilitado o inhabilitado es obligatorio').not().isEmpty(),
        validarCampos)
    private async generarListadoPostulacionesRechadas(
            req: express.Request, 
            res: express.Response, 
            next: express.NextFunction) {
        let postulaciones: Postulacion [] = await this.reportePostulacionesService.generarListadoPostulacionesRechazadasPorOcupacion(req.body);
        let ocupacion: Ocupacion = await this.ocupacionService.buscar(req.body.id_ocupacion);
       // let total: number = await this.reporteSolicitanteService.contarSolicitantes(req.body);
        return res.status(200).json({
            ok: true,
            postulaciones,
            ocupacion,
            total: 0
        });
    }

        @httpPost("/solicitantes-aceptados",verificaToken, 
        body('id_ciudad','El id de la ciudad es oblidatorio').not().isEmpty(),
        body('id_ocupacion','El id de la ocupacion es obligatorio').not().isEmpty(),
        body('fecha_inicio','La fecha de inicio es obligatoria').not().isEmpty(),
        body('fecha_fin','la fecha de finalizacion es obligatoria').not().isEmpty(),
        body('habilitado','El valor de todos, habilitado o inhabilitado es obligatorio').not().isEmpty(),
        validarCampos)
    private async generarListadoSolicitantesContratados(
            req: express.Request, 
            res: express.Response, 
            next: express.NextFunction) {
        let contrataciones = await this.reporteContratacionService.generarListadoContratacionesPorNumeroDeContrataciones(req.body);
        let ocupacion: Ocupacion = await this.ocupacionService.buscar(req.body.id_ocupacion);
        return res.status(200).json({
            ok: true,
            contrataciones,
            ocupacion
        });
    }
}