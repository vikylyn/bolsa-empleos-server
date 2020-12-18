import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Ocupacion } from './ocupacion';
import { Idioma } from './idioma';
import { RequisitosIdioma } from './requisitos-idioma';


@Entity('requisitos')
export class Requisitos {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    experiencia: number;
    
    @Column({type: 'varchar', length: 1})
    genero: string;
      
    @JoinColumn({name:'ocupaciones_id'}) 
    @ManyToOne(type => Ocupacion, ocupacion => ocupacion.id, {nullable: false, eager: true})  
    ocupacion: Ocupacion; 

    @OneToMany(type => RequisitosIdioma, requisitos_idioma => requisitos_idioma.requisitos, {eager: true})
    idiomas: RequisitosIdioma[];

  /*  @JoinColumn({name:'idiomas_id'}) 
    @ManyToOne(type => Idioma, idioma => idioma.id, {nullable: false, eager: true})  
    idioma: Idioma;
 */
}