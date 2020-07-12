import {Column, PrimaryGeneratedColumn,JoinColumn,OneToOne} from 'typeorm';
import {Credenciales} from './credenciales'
export abstract class Usuario {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 45})
    nombre: string;

    @Column({type: 'varchar', length: 60})
    apellidos: string;

    @Column({type: 'varchar', length: 100, nullable:true})
    imagen: string;

    @Column({type: 'varchar', length: 50})
    telefono: string;

    @Column({type: 'varchar', length: 10})
    cedula: string;

    @Column({type: 'varchar', length: 1})
    sexo: string;

    @Column()
    habilitado: boolean;

    @OneToOne(type => Credenciales,{nullable: false})
    @JoinColumn({name: 'credenciales_id'})
    credenciales: Credenciales;

}