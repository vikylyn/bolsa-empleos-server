import { Column, PrimaryGeneratedColumn, JoinColumn, OneToOne,ManyToOne } from 'typeorm';
import {Credenciales} from './credenciales';
import { Imagen } from './imagen';
import { Ciudad } from './ciudad';


export abstract class Usuario {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 45})
    nombre: string;

    @Column({type: 'varchar', length: 60})
    apellidos: string;

    @Column({type: 'varchar', length: 50})
    telefono: string;

    @Column({type: 'varchar', length: 20, nullable: false})
    cedula: string;

    @Column({type: 'varchar', length: 10, nullable: true})
    num_complemento_ci: string;


    @Column({type: 'varchar', length: 1})
    genero: string;

    @Column({nullable: false, default: false})  
    habilitado: boolean;

    @OneToOne(type => Credenciales,{nullable: false, eager: true})
    @JoinColumn({name: 'credenciales_id'})  
    credenciales: Credenciales;

    @OneToOne(type => Imagen,{nullable: false, eager: true})
    @JoinColumn({name: 'imagenes_id'})  
    imagen: Imagen;

    @Column({type: 'varchar', length: 45})
    direccion: string;   

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    creado_en: Date;
    @JoinColumn({name:'ciudades_id'})
    @ManyToOne(type => Ciudad, ciudad => ciudad.id, {nullable: false, eager: true})  
    ciudad: Ciudad;
    
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    modificado_en: Date;
}