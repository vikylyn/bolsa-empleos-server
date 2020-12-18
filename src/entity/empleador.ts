import { Usuario } from './usuario';
import { Entity, Column, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Ciudad } from './ciudad';
import { Vacante } from './vacante';



@Entity('empleadores')
export class Empleador extends Usuario {
    @Column({type: 'varchar', length: 20})
    nacionalidad: string;

    @Column()
    empresa: Boolean;

  //  @JoinColumn({name:'empleadores_id'})
    @OneToMany(type => Vacante, vacante => vacante.empleador)  
    vacante: Vacante[];
    
}