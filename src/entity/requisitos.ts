import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Ocupacion } from './ocupacion';
import { Idioma } from './idioma';


@Entity('requisitos')
export class Requisitos {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    experiencia: number;
    
    @Column({type: 'varchar', length: 1})
    genero: string;
      
    @JoinColumn({name:'profesiones_id'}) 
    @ManyToOne(type => Ocupacion, ocupacion => ocupacion.id, {nullable: false, eager: true})  
    ocupacion: Ocupacion; 

    @JoinColumn({name:'idiomas_id'}) 
    @ManyToOne(type => Idioma, idioma => idioma.id, {nullable: false, eager: true})  
    idioma: Idioma;
 
}