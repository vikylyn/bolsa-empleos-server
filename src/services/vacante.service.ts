import { injectable} from "inversify";

import { getRepository, getConnection } from 'typeorm';
import { IVacanteService } from '../interfaces/IVacante.service';
import { Requisitos } from '../entity/requisitos';

import {Vacante} from '../entity/vacante'
import { RequisitosIdioma } from '../entity/requisitos-idioma';

@injectable()
class VacanteService  implements IVacanteService  {
    async filtrarVacantesAscendente(body: any, desde: number) {
        let fecha = new Date();
        let mes = fecha.getMonth() + 1;
        let fechaActual = `${fecha.getFullYear()}-${mes}-${fecha.getDate()}`;
        let consulta = "requisitos.ocupacion.id = :ocupacion ";
        if(parseInt(body.id_ciudad) > 0) {
            consulta +="and ciudad.id = :ciudad_id ";
        }
        if(parseInt(body.id_tipo_contrato) > 0) {
            consulta +="and tipo_contrato.id = :tipo_contrato_id ";
        }
        if(fechaActual != body.fecha) {
            fechaActual += ' 00:00:00';
            consulta += "and vacantes.creado_en >= :creado_en ";
        }

        consulta += "and vacantes.habilitado = true";

        const vacantes = await 
        getRepository(Vacante)
       .createQueryBuilder("vacantes")
       .leftJoinAndSelect("vacantes.sueldo", "sueldo")
       .leftJoinAndSelect("vacantes.periodo_pago", "periodo_pago")
       .leftJoinAndSelect("vacantes.horario", "horario")
       .leftJoinAndSelect("vacantes.requisitos", "requisitos")
       .leftJoinAndSelect("requisitos.ocupacion", "requisitos.ocupacion")
       .leftJoinAndSelect("requisitos.idiomas", "idiomas")
       .leftJoinAndSelect("vacantes.tipo_contrato", "tipo_contrato")
       .leftJoinAndSelect("vacantes.ciudad", "ciudad")
       .leftJoinAndSelect("ciudad.estado", "estado")
       .leftJoinAndSelect("estado.pais", "pais")
       .leftJoinAndSelect("vacantes.empleador", "empleador")
       .leftJoinAndSelect("empleador.imagen", "imagen")
       .leftJoinAndSelect("empleador.empresa", "empresa")
       .leftJoinAndSelect("empresa.logo", "logo")
       .leftJoinAndSelect("empresa.razon_social", "razon_social")
       .leftJoinAndSelect("empresa.ciudad", "ciudad_empresa")
       .leftJoinAndSelect("ciudad_empresa.estado", "estado_empresa")
       .leftJoinAndSelect("estado_empresa.pais", "pais_empresa")
       .where( consulta, { ocupacion: body.id_ocupacion, ciudad_id: body.id_ciudad, tipo_contrato_id: body.id_tipo_contrato, creado_en: body.fecha })
       .addOrderBy("vacantes.creado_en", "ASC")
       .skip(desde)  
       .take(6)
       .getMany();
       return vacantes;
    }
    async filtrarVacantesDescendente(body: any, desde: number) {
        let fecha = new Date();
        let mes = fecha.getMonth() + 1;
        let fechaActual = `${fecha.getFullYear()}-${mes}-${fecha.getDate()}`;
        let consulta = "requisitos.ocupacion.id = :ocupacion ";
        if(parseInt(body.id_ciudad) > 0) {
            consulta +="and ciudad.id = :ciudad_id ";
        }
        if(parseInt(body.id_tipo_contrato) > 0) {
            consulta +="and tipo_contrato.id = :tipo_contrato_id ";
        }
        if(fechaActual != body.fecha) {
            fechaActual += ' 00:00:00';
            consulta += "and vacantes.creado_en >= :creado_en ";
        }

        consulta += "and vacantes.habilitado = true";

        const vacantes = await 
        getRepository(Vacante)
       .createQueryBuilder("vacantes")
       .leftJoinAndSelect("vacantes.sueldo", "sueldo")
       .leftJoinAndSelect("vacantes.periodo_pago", "periodo_pago")
       .leftJoinAndSelect("vacantes.horario", "horario")
       .leftJoinAndSelect("vacantes.requisitos", "requisitos")
       .leftJoinAndSelect("requisitos.ocupacion", "requisitos.ocupacion")
       .leftJoinAndSelect("requisitos.idiomas", "idiomas")
       .leftJoinAndSelect("vacantes.tipo_contrato", "tipo_contrato")
       .leftJoinAndSelect("vacantes.ciudad", "ciudad")
       .leftJoinAndSelect("ciudad.estado", "estado")
       .leftJoinAndSelect("estado.pais", "pais")
       .leftJoinAndSelect("vacantes.empleador", "empleador")
       .leftJoinAndSelect("empleador.imagen", "imagen")
       .leftJoinAndSelect("empleador.empresa", "empresa")
       .leftJoinAndSelect("empresa.logo", "logo")
       .leftJoinAndSelect("empresa.razon_social", "razon_social")
       .leftJoinAndSelect("empresa.ciudad", "ciudad_empresa")
       .leftJoinAndSelect("ciudad_empresa.estado", "estado_empresa")
       .leftJoinAndSelect("estado_empresa.pais", "pais_empresa")
       .where( consulta, { ocupacion: body.id_ocupacion, ciudad_id: body.id_ciudad, tipo_contrato_id: body.id_tipo_contrato, creado_en: body.fecha })
       .addOrderBy("vacantes.creado_en", "DESC")
       .skip(desde)  
       .take(6)
       .getMany();
       return vacantes;
    }
    async contarFiltrados(body: any) {
        let fecha = new Date();
        let mes = fecha.getMonth() + 1;
        let fechaActual = `${fecha.getFullYear()}-${mes}-${fecha.getDate()}`;
        let consulta = "requisitos.ocupacion.id = :ocupacion ";
        if(parseInt(body.id_ciudad) > 0) {
            consulta +="and ciudad.id = :ciudad_id ";
        }
        if(parseInt(body.id_tipo_contrato) > 0) {
            consulta +="and tipo_contrato.id = :tipo_contrato_id ";
        }
        if(fechaActual != body.fecha) {
            fechaActual += ' 00:00:00';
            consulta += "and vacantes.creado_en >= :creado_en ";
        }

        consulta += "and vacantes.habilitado = true";

        const total = await 
        getRepository(Vacante)
       .createQueryBuilder("vacantes")
       .leftJoinAndSelect("vacantes.sueldo", "sueldo")
       .leftJoinAndSelect("vacantes.periodo_pago", "periodo_pago")
       .leftJoinAndSelect("vacantes.horario", "horario")
       .leftJoinAndSelect("vacantes.requisitos", "requisitos")
       .leftJoinAndSelect("requisitos.ocupacion", "requisitos.ocupacion")
       .leftJoinAndSelect("requisitos.idiomas", "idiomas")
       .leftJoinAndSelect("vacantes.tipo_contrato", "tipo_contrato")
       .leftJoinAndSelect("vacantes.ciudad", "ciudad")
       .leftJoinAndSelect("ciudad.estado", "estado")
       .leftJoinAndSelect("estado.pais", "pais")
       .leftJoinAndSelect("vacantes.empleador", "empleador")
       .leftJoinAndSelect("empleador.imagen", "imagen")
       .where( consulta, { ocupacion: body.id_ocupacion, ciudad_id: body.id_ciudad, tipo_contrato_id: body.id_tipo_contrato, creado_en: body.fecha })
       .addOrderBy("vacantes.creado_en", "DESC")
       .getCount();
       return total;
    }
    async listarTodas(id: number, desde: number) { 
        const vacantes = await 
         getRepository(Vacante)
        .createQueryBuilder("vacantes")
        .leftJoinAndSelect("vacantes.sueldo", "sueldo")
        .leftJoinAndSelect("vacantes.periodo_pago", "periodo_pago")
        .leftJoinAndSelect("vacantes.horario", "horario")
        .leftJoinAndSelect("vacantes.requisitos", "requisitos")
        .leftJoinAndSelect("requisitos.ocupacion", "ocupacion")
        .leftJoinAndSelect("requisitos.idiomas", "idiomas")
        .leftJoinAndSelect("vacantes.tipo_contrato", "tipo_contrato")
        .leftJoinAndSelect("vacantes.ciudad", "ciudad")
        .leftJoinAndSelect("vacantes.empleador", "empleador")
        .where("vacantes.empleador.id = :id", { id: id })
        .addOrderBy("vacantes.creado_en", "DESC")
        .skip(desde)  
        .take(5)
        .getMany();
        return vacantes;
    }
    async listarHabilitadas(id: number, desde: number) { 
        const vacantes = await 
         getRepository(Vacante)
        .createQueryBuilder("vacantes")
        .leftJoinAndSelect("vacantes.sueldo", "sueldo")
        .leftJoinAndSelect("vacantes.periodo_pago", "periodo_pago")
        .leftJoinAndSelect("vacantes.horario", "horario")
        .leftJoinAndSelect("vacantes.requisitos", "requisitos")
        .leftJoinAndSelect("requisitos.ocupacion", "ocupacion")
        .leftJoinAndSelect("requisitos.idiomas", "idiomas")
        .leftJoinAndSelect("vacantes.tipo_contrato", "tipo_contrato")
        .leftJoinAndSelect("vacantes.ciudad", "ciudad")
        .leftJoinAndSelect("vacantes.empleador", "empleador")
        .where("vacantes.empleador.id = :id and vacantes.habilitado = true", { id: id })
        .addOrderBy("vacantes.creado_en", "DESC")
        .skip(desde)  
        .take(5)
        .getMany();
        return vacantes;
    }
    async listarHabilitadasSinPaginacion(id: number) { 
        const vacantes = await 
         getRepository(Vacante)
        .createQueryBuilder("vacantes")
        .leftJoinAndSelect("vacantes.sueldo", "sueldo")
        .leftJoinAndSelect("vacantes.periodo_pago", "periodo_pago")
        .leftJoinAndSelect("vacantes.horario", "horario")
        .leftJoinAndSelect("vacantes.requisitos", "requisitos")
        .leftJoinAndSelect("requisitos.ocupacion", "ocupacion")
        .leftJoinAndSelect("vacantes.tipo_contrato", "tipo_contrato")
        .leftJoinAndSelect("vacantes.ciudad", "ciudad")
        .leftJoinAndSelect("ciudad.estado", "estado")
        .leftJoinAndSelect("estado.pais", "pais")
        .leftJoinAndSelect("vacantes.empleador", "empleador")
        .leftJoinAndSelect("requisitos.idiomas", "idiomas")
        .leftJoinAndSelect("idiomas.idioma", "idioma")
        .where("vacantes.empleador.id = :id and vacantes.habilitado = true", { id: id })
        .addOrderBy("vacantes.creado_en", "DESC")
        .getMany();
        return vacantes;
    }
    async listarInhabilitadas(id: number, desde: number) { 
        const vacantes = await 
         getRepository(Vacante)
        .createQueryBuilder("vacantes")
        .leftJoinAndSelect("vacantes.sueldo", "sueldo")
        .leftJoinAndSelect("vacantes.periodo_pago", "periodo_pago")
        .leftJoinAndSelect("vacantes.horario", "horario")
        .leftJoinAndSelect("vacantes.requisitos", "requisitos")
        .leftJoinAndSelect("requisitos.ocupacion", "ocupacion")
        .leftJoinAndSelect("requisitos.idiomas", "idiomas")
        .leftJoinAndSelect("vacantes.tipo_contrato", "tipo_contrato")
        .leftJoinAndSelect("vacantes.ciudad", "ciudad")
        .leftJoinAndSelect("vacantes.empleador", "empleador")
        .where("vacantes.empleador.id = :id and vacantes.habilitado = false", { id: id })
        .addOrderBy("vacantes.creado_en", "DESC")
        .skip(desde)  
        .take(5)
        .getMany();
        return vacantes;
    }
    async contarTodas(id_empleador: number) {
        const total = await 
         getRepository(Vacante)
        .createQueryBuilder("vacantes")
        .leftJoinAndSelect("vacantes.empleador", "empleador")
        .where("vacantes.empleador.id = :id", { id: id_empleador })
        .getCount()
        return total;
    }
    async contarHabilitadas(id_empleador: number) {
        const total = await 
         getRepository(Vacante)
        .createQueryBuilder("vacantes")
        .leftJoinAndSelect("vacantes.empleador", "empleador")
        .where("vacantes.empleador.id = :id and vacantes.habilitado = true", { id: id_empleador })
        .getCount()
        return total;
    }
    async contarInhabilitadas(id_empleador: number) {
        const total = await 
         getRepository(Vacante)
        .createQueryBuilder("vacantes")
        .leftJoinAndSelect("vacantes.empleador", "empleador")
        .where("vacantes.empleador.id = :id and vacantes.habilitado = false", { id: id_empleador })
        .getCount()
        return total;
    }
    async adicionar(body: any) {
        
        let respuesta: any;
        const connection = getConnection();
            const queryRunner = connection.createQueryRunner();

            // establish real database connection using our new query runner
            await queryRunner.connect();

            // lets now open a new transaction:
            await queryRunner.startTransaction();
            try {
                // execute some operations on this transaction:
                let requisitos= await queryRunner.manager.save(Requisitos, 
                    {
                        experiencia: body.experiencia,
                        genero: body.genero,
                        ocupacion: {id: body.id_ocupacion}
                     //   idioma: {id: body.id_idioma}
                    });
                const idiomas: RequisitosIdioma[] = body.idiomas;
                for (let index = 0; index < idiomas.length; index++) {
                    await queryRunner.manager.save(RequisitosIdioma, 
                        {
                            idioma: idiomas[index].idioma,
                            nivel_escrito: idiomas[index].nivel_escrito,
                            nivel_oral: idiomas[index].nivel_oral,
                            nivel_lectura: idiomas[index].nivel_lectura,
                            requisitos: requisitos                       
                        });
                }
                let vacante_nueva = await queryRunner.manager.save(Vacante,
                    {    
                        titulo: body.titulo,
                        sueldo: {id: body.id_sueldo},
                        periodo_pago: {id: body.id_periodo_pago},
                        direccion: body.direccion,
                        horario: {id: body.id_horario},
                        num_vacantes: body.num_vacantes,
                        num_disponibles: body.num_vacantes,
                        num_postulantes_aceptados: 0,
                     //   funciones: body.funciones,
                        descripcion: body.descripcion,
                        habilitado: body.habilitado,
                        requisitos: requisitos,
                        tipo_contrato: {id: body.id_tipo_contrato},
                        tipo_jornada: {id: body.id_tipo_jornada},
                        ciudad: {id: body.id_ciudad},
                        empleador: {id: body.id_empleador}
                    });
                await queryRunner.commitTransaction();

                respuesta = vacante_nueva;
                
            
            } catch (err) {
            
                // since we have errors let's rollback changes we made
                await queryRunner.rollbackTransaction();
                respuesta = err;
            
            } finally {
            
                // you need to release query runner which is manually created:
                await queryRunner.release();
            }

            return respuesta;
    }
    async modificar(id: number, body: any) {
        let habilitado = false;
        if(body.habilitado === true || body.habilitado === 'true') {
            habilitado = true;
        }
        let respuesta: any;
        const connection = getConnection();
            const queryRunner = connection.createQueryRunner();

            // establish real database connection using our new query runner
            await queryRunner.connect();

            // lets now open a new transaction:
            await queryRunner.startTransaction();
            try {

                await getRepository(Requisitos)
                    .createQueryBuilder()
                    .update(Requisitos)
                    .set( {
                        experiencia: body.experiencia,
                        genero: body.genero,
                        ocupacion: {id: body.id_ocupacion}
                    })
                    .where("id = :id", { id: body.id_requisitos })
                    .execute();

                await getRepository(RequisitosIdioma)
                    .createQueryBuilder("requisitos_idiomas")
                    .leftJoinAndSelect("requisitos_idiomas.requisitos","requisitos")
                    .delete()
                    .where("requisitos.id = :id", { id: body.id_requisitos })
                    .execute();

                await getRepository(Vacante)
                .createQueryBuilder()
                .update(Vacante)
                .set({
                    titulo: body.titulo,
                    sueldo: {id: body.id_sueldo},
                    periodo_pago: {id: body.id_periodo_pago},
                    direccion: body.direccion,
                    horario: {id: body.id_horario},
                    num_vacantes: body.num_vacantes,
                    num_disponibles: body.num_disponibles,
                    descripcion: body.descripcion,
                    habilitado: habilitado,
                    tipo_contrato: {id: body.id_tipo_contrato},
                    tipo_jornada: {id: body.id_tipo_jornada},
                    ciudad: {id: body.id_ciudad},
                })
                .where("id = :id", { id: id })
                .execute();
               

                const idiomas: RequisitosIdioma[] = body.idiomas;
                for (let index = 0; index < idiomas.length; index++) {
                    await queryRunner.manager.save(RequisitosIdioma, 
                        {
                            idioma: idiomas[index].idioma,
                            nivel_escrito: idiomas[index].nivel_escrito,
                            nivel_oral: idiomas[index].nivel_oral,
                            nivel_lectura: idiomas[index].nivel_lectura,
                            requisitos: {id: body.id_requisitos}                     
                        });
                }
                await queryRunner.commitTransaction();

                respuesta = true;
                
            
            } catch (err) {
            
                // since we have errors let's rollback changes we made
                await queryRunner.rollbackTransaction();
                respuesta = err;
            
            } finally {
            
                // you need to release query runner which is manually created:
                await queryRunner.release();
            }

            return respuesta;
    }
    async inhabilitar(id: number) {
        const respuesta = await getRepository(Vacante)
        .createQueryBuilder()
        .update(Vacante)
        .set({
            habilitado: false,
        })
        .where("id = :id", { id: id })
        .execute();
        return respuesta;
    }
    async habilitar(id: number) {
        const respuesta = await getRepository(Vacante)
        .createQueryBuilder()
        .update(Vacante)
        .set({
            habilitado: true,
        })
        .where("id = :id", { id: id })
        .execute();
        return respuesta;
    }
    async buscar(id: number) {
        const vacante = await 
        getRepository(Vacante)
        .createQueryBuilder("vacantes")
        .leftJoinAndSelect("vacantes.sueldo", "sueldo")
        .leftJoinAndSelect("vacantes.periodo_pago", "periodo_pago")
        .leftJoinAndSelect("vacantes.horario", "horario")
        .leftJoinAndSelect("vacantes.requisitos", "requisitos")
        .leftJoinAndSelect("requisitos.ocupacion", "ocupacion")
        .leftJoinAndSelect("requisitos.idiomas", "idiomas")
        .leftJoinAndSelect("idiomas.idioma", "idioma")
        .leftJoinAndSelect("idiomas.nivel_escrito", "nivel_escrito")
        .leftJoinAndSelect("idiomas.nivel_oral", "nivel_oral")
        .leftJoinAndSelect("idiomas.nivel_lectura", "nivel_lectura")
        .leftJoinAndSelect("vacantes.tipo_contrato", "tipo_contrato")
        .leftJoinAndSelect("vacantes.tipo_jornada", "tipo_jornada")
        .leftJoinAndSelect("vacantes.ciudad", "ciudad")
        .leftJoinAndSelect("ciudad.estado", "estado")
        .leftJoinAndSelect("estado.pais", "pais")
        .leftJoinAndSelect("vacantes.empleador", "empleador")
        .leftJoinAndSelect("empleador.imagen", "imagen")
        .leftJoinAndSelect("empleador.ciudad", "ciudad_empleador")
        .leftJoinAndSelect("ciudad_empleador.estado", "estado_empleador")
        .leftJoinAndSelect("estado_empleador.pais", "pais_empleador")
        .leftJoinAndSelect("empleador.credenciales", "credenciales")
        .leftJoinAndSelect("empleador.empresa", "empresa")
        .leftJoinAndSelect("empresa.logo", "logo")
        .leftJoinAndSelect("empresa.razon_social", "razon_social")
        .leftJoinAndSelect("empresa.ciudad", "ciudad_empresa")
        .leftJoinAndSelect("ciudad_empresa.estado", "estado_empresa")
        .leftJoinAndSelect("estado_empresa.pais", "pais_empresa")
        .where("vacantes.id = :id", { id: id })
       .getOne();
        if(vacante){
            vacante.empleador.credenciales.password = "xd";
        }
       return vacante;
    }
   
    async busqueda(valor: string, id_empleador: number) {
        const vacantes = await 
         getRepository(Vacante)
        .createQueryBuilder("vacantes")
        .leftJoinAndSelect("vacantes.sueldo", "sueldo")
        .leftJoinAndSelect("vacantes.periodo_pago", "periodo_pago")
        .leftJoinAndSelect("vacantes.horario", "horario")
        .leftJoinAndSelect("vacantes.requisitos", "requisitos")
        .leftJoinAndSelect("requisitos.ocupacion", "ocupacion")
        .leftJoinAndSelect("requisitos.idiomas", "idiomas")
        .leftJoinAndSelect("vacantes.tipo_contrato", "tipo_contrato")
        .leftJoinAndSelect("vacantes.ciudad", "ciudad")
        .leftJoinAndSelect("vacantes.empleador", "empleador")
        .where("(vacantes.titulo regexp :valor and vacantes.empleador.id = :id) || (ocupacion.nombre regexp :valor and vacantes.empleador.id = :id)",{valor: valor, id: id_empleador})
        .addOrderBy("vacantes.creado_en", "DESC")
        .getMany()
        return vacantes;
     }
}
  
export {VacanteService};  