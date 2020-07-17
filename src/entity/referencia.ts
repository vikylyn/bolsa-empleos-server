import {Entity, Column, PrimaryGeneratedColumn,JoinColumn, ManyToOne} from 'typeorm';
import { Curriculum } from './curriculum';

@Entity('referencias')
export class Referencia {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 45})
    nombre: string;

    @Column({type: 'varchar', length: 60})
    apellidos: string;

    @Column({type: 'varchar', length: 45})
    empresa: string;

    @Column({type: 'varchar', length: 45})
    cargo: string;

    @Column({type: 'varchar', length: 50})
    telefono: string;

    @JoinColumn({name:'curriculums_id'})
    @ManyToOne(type => Curriculum, curriculum => curriculum.id,{nullable:false})
    curriculum: Curriculum

}