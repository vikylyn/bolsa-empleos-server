import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import { Credenciales } from './credenciales';


@Entity('roles')
export class Rol {
   
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({type: 'varchar', length: 50,unique: true})
    nombre: string;   

}
