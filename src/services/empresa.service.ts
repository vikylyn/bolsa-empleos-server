import { injectable} from 'inversify';
import { getRepository} from "typeorm";

import { IEmpresaService } from '../interfaces/IEmpresa.service';
import { Empresa } from '../entity/empresa';
import { Imagen } from '../entity/imagen';

@injectable()
class EmpresaService implements IEmpresaService  {
   
    // Candidato a eliminacion
    async listar(desde: number) {
        const empleadores = await getRepository(Empresa)
        .createQueryBuilder("empresas")
        .skip(desde)  
        .take(5)
        .getMany();
        return empleadores ;
    }
   
    async modificar(id: number, body: any) {
     
        const empresa_modificada = await getRepository(Empresa)
        .createQueryBuilder()  
        .update(Empresa)
        .set({
            nombre:body.nombre, 
            razon_social: {id: body.id_razon_social},
            dominio_web: body.dominio_web, 
            direccion: body.direccion, 
            telefono: body.telefono, 
            descripcion: body.descripcion, 
            empleador: {id: body.id_empleador},
            ciudad: {id: body.id_ciudad},
        })
        .where("id = :id", { id: id })
        .execute();
 
        return empresa_modificada;
   
    }

    async buscar(id: number) {
        const empresa = await  getRepository(Empresa).findOne(id);
        return empresa;
    } 
    async buscarPorIdEmpleador(id_empleador: number) {
        const respuesta = await getRepository(Empresa)
        .createQueryBuilder("empresas")
        .leftJoinAndSelect("empresas.empleador", "empleador")
        .leftJoinAndSelect("empresas.logo", "logo")
        .leftJoinAndSelect("empresas.ciudad", "ciudad")
        .leftJoinAndSelect("ciudad.estado", "estado")
        .leftJoinAndSelect("estado.pais", "pais")
        .leftJoinAndSelect("empresas.razon_social", "razon_social")
        .where("empresas.empleador.id = :id", { id: id_empleador })
        .getOne();
    
        return respuesta;
    }
    async modificarImagen(id: number, imagen: Imagen) {
        const empleador = await getRepository(Empresa)
        .createQueryBuilder()
        .update(Empresa)
        .set({logo: imagen})
        .where("id = :id", { id: id })
        .execute();
        return empleador;
    }

}
export { EmpresaService };  