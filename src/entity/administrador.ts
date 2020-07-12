import { Usuario } from './usuario';
import {Entity} from 'typeorm';



@Entity('administradores')
export class Administrador extends Usuario {


}