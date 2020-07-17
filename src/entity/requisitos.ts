import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Profesion } from './profesion';
import { Idioma } from './idioma';


@Entity('requisitos')
export class Requisitos {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    experiencia: number;
    
    @Column({type: 'varchar', length: 1})
    sexo: string;
      
    @JoinColumn({name:'profesiones_id'}) 
    @ManyToOne(type => Profesion, profesion => profesion.id, {nullable: false, eager: true})  
    profesion: Profesion; 

    @JoinColumn({name:'idiomas_id'}) 
    @ManyToOne(type => Idioma, idioma => idioma.id, {nullable: false, eager: true})  
    idioma: Idioma;
 
}