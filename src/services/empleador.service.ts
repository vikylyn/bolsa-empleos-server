import { injectable, inject } from 'inversify';
import { getRepository,getConnection  } from "typeorm";
import { Credenciales } from '../entity/credenciales';
import bcrypt from 'bcryptjs';
import { IEmpleadorService } from '../interfaces/IEmpleador.service';
import { Empleador } from '../entity/empleador';
import { Imagen } from '../entity/imagen';
import { Empresa } from '../entity/empresa';


@injectable()
class EmpleadorService implements IEmpleadorService  {
   
    async buscarPorCredencial(id: number) {
        const empleador = await  getRepository(Empleador) 
        .createQueryBuilder("empleador")
        .leftJoinAndSelect("empleador.imagen", "imagen")
        .leftJoinAndSelect("empleador.empresa", "empresa")
        .leftJoinAndSelect("empresa.logo", "logo")
        .leftJoinAndSelect("empresa.ciudad", "ciudad_empresa")
        .leftJoinAndSelect("ciudad_empresa.estado", "estado_empresa")
        .leftJoinAndSelect("estado_empresa.pais", "pais_empresa")
        .where("empleador.credenciales_id = :id", { id: id })  
        .getOne();
        return empleador;
    }  
    async listar(desde: number) {
        const empleadores = await getRepository(Empleador)
        .createQueryBuilder("empleadores")
        .leftJoinAndSelect("empleadores.imagen", "imagen")
        .skip(desde)  
        .take(5)
        .getMany();
        return empleadores ;
    }
    async adicionarEmpleador(body: any) {
        let respuesta: any;
        const connection = getConnection();
            const queryRunner = connection.createQueryRunner();

            // establish real database connection using our new query runner
            await queryRunner.connect();

            // lets now open a new transaction:
            await queryRunner.startTransaction();
            try {
                // execute some operations on this transaction:
                let credencial= await queryRunner.manager.save(Credenciales, 
                    {email: body.email, 
                     password: bcrypt.hashSync(body.password,10) ,
                     rol: {id: body.id_rol}
                    });
                console.log(credencial);
                let imagen = await queryRunner.manager.save(Imagen, 
                    { id_cloudinary: 'no-image2_uyivib',
                      formato: 'png',
                      url: 'http://res.cloudinary.com/dl8ifr7sr/image/upload/v1595442138/no-image2_uyivib.png',
                      url_segura: 'https://res.cloudinary.com/dl8ifr7sr/image/upload/v1595442138/no-image2_uyivib.png'});
                        
                    
                let empleador_guardado = await queryRunner.manager.save(Empleador,
                    {
                        nombre:body.nombre, 
                        apellidos: body.apellidos, 
                        imagen: imagen, 
                        telefono: body.telefono, 
                        cedula: body.cedula, 
                        num_complemento_ci: body.num_complemento_ci,
                        genero: body.genero, 
                        habilitado: true,
                        existe_empresa: false,
                        nacionalidad: body.nacionalidad,
                        direccion:body.direccion,
                        ciudad: {id: body.id_ciudad},
                        credenciales: credencial
                    });
                await queryRunner.commitTransaction();

            //    empleador_guardado.credenciales.password = 'xd';
                respuesta = empleador_guardado;
                
            
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
    async adicionarEmpleadorEmpresa(body: any) {
        let respuesta: any;
        const connection = getConnection();
            const queryRunner = connection.createQueryRunner();

            // establish real database connection using our new query runner
            await queryRunner.connect();

            // lets now open a new transaction:
            await queryRunner.startTransaction();
            try {
                // execute some operations on this transaction:
                let credencial= await queryRunner.manager.save(Credenciales, 
                    {email: body.email, 
                     password: bcrypt.hashSync(body.password,10) ,
                     rol: {id: body.id_rol}
                    });
                let imagen = await queryRunner.manager.save(Imagen, 
                    { id_cloudinary: 'no-image2_uyivib',
                      formato: 'png',
                      url: 'http://res.cloudinary.com/dl8ifr7sr/image/upload/v1595442138/no-image2_uyivib.png',
                      url_segura: 'https://res.cloudinary.com/dl8ifr7sr/image/upload/v1595442138/no-image2_uyivib.png'});
                        
                    
                let empleador_guardado = await queryRunner.manager.save(Empleador,
                    {
                        nombre:body.nombre, 
                        apellidos: body.apellidos, 
                        imagen: imagen, 
                        telefono: body.telefono, 
                        cedula: body.cedula, 
                        num_complemento_ci: body.num_complemento_ci,
                        genero: body.genero, 
                        habilitado: true,
                        existe_empresa: true,
                        nacionalidad: body.nacionalidad,
                        direccion:body.direccion,
                        ciudad: {id: body.id_ciudad},
                        credenciales: credencial
                    });
                let imagen2 = await queryRunner.manager.save(Imagen, 
                        { id_cloudinary: 'no-image2_uyivib',
                          formato: 'png',
                          url: 'http://res.cloudinary.com/dl8ifr7sr/image/upload/v1595442138/no-image2_uyivib.png',
                          url_segura: 'https://res.cloudinary.com/dl8ifr7sr/image/upload/v1595442138/no-image2_uyivib.png'});
                let empresa_guardada = await queryRunner.manager.save(Empresa,{
                        nombre: body.empresa_nombre,
                        dominio_web: body.empresa_dominio_web,
                        direccion: body.empresa_direccion,
                        telefono: body.empresa_telefono,
                        descripcion: body.empresa_descripcion,
                        logo: imagen2,
                        empleador: empleador_guardado,
                        ciudad: {id: body.id_ciudad}
                      });
                await queryRunner.commitTransaction();

                empleador_guardado.credenciales.password = 'xd';
                respuesta = empleador_guardado;
                
            
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
    async modificar(empleador: Empleador, body: any) {
     
        const empleador_modificado = await getRepository(Empleador)
        .createQueryBuilder()  
        .update(Empleador)
        .set({
            nombre:body.nombre, 
            apellidos: body.apellidos, 
            telefono: body.telefono, 
            cedula: body.cedula, 
            num_complemento_ci: body.num_complemento_ci,
            genero: body.genero, 
            modificado_en: new Date(),
            nacionalidad: body.nacionalidad,
            direccion:body.direccion,
            ciudad: {id: body.id_ciudad}
        })
        .where("id = :id", { id: empleador.id })
        .execute();
        const credencial = await getRepository(Credenciales)
        .createQueryBuilder()
        .update(Credenciales)
        .set({email: body.email})
        .where("id = :id", { id: empleador.credenciales.id })
        .execute();
        return empleador_modificado;
   
}


    async eliminar(id: number) {
        const respuesta = await getRepository(Empleador)
        .createQueryBuilder()
        .update(Empleador)
        .set({habilitado: false})
        .where("id = :id", { id: id })
        .execute(); 
        return respuesta;
    }
    async buscar(id: number) {
        const empleador = await  getRepository(Empleador).findOne(id);
        if(empleador){
            empleador.credenciales.password = 'xd' 
        }
        return empleador;
    } 

    async habilitar(id: number) {
        const respuesta = await getRepository(Empleador)
        .createQueryBuilder()
        .update(Empleador)
        .set({habilitado: true})
        .where("id = :id", { id: id })
        .execute(); 
        return respuesta;
    }

    async modificarImagen(id: number, imagen: Imagen) {
        const empleador = await getRepository(Empleador)
        .createQueryBuilder()
        .update(Empleador)
        .set({imagen: imagen})
        .where("id = :id", { id: id })
        .execute();
        return empleador;
    }

}
export { EmpleadorService };  