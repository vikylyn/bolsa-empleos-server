import { Column, PrimaryGeneratedColumn, JoinColumn, OneToOne,ManyToOne } from 'typeorm';
import {Credenciales} from './credenciales';
import { Imagen } from './imagen';


export abstract class Usuario {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 45})
    nombre: string;

    @Column({type: 'varchar', length: 60})
    apellidos: string;

 

    @Column({type: 'varchar', length: 50})
    telefono: string;

    @Column({type: 'varchar', length: 10})
    cedula: string;

    @Column({type: 'varchar', length: 1})
    genero: string;

    @Column()
    habilitado: boolean;

    @OneToOne(type => Credenciales,{nullable: false, eager: true})
    @JoinColumn({name: 'credenciales_id'})  
    credenciales: Credenciales;

    @OneToOne(type => Imagen,{nullable: false, eager: true})
    @JoinColumn({name: 'imagenes_id'})  
    imagen: Imagen;

}