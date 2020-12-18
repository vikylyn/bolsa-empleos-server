import { Usuario } from './usuario';
import { Entity, Column } from 'typeorm';

@Entity('administradores')
export class Administrador extends Usuario {


}