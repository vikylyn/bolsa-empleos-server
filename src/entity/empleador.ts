import { Usuario } from './usuario';
import { Entity, Column, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Vacante } from './vacante';
import { Empresa } from './empresa';



@Entity('empleadores')
export class Empleador extends Usuario {
    @Column({type: 'varchar', length: 20})
    nacionalidad: string;

    @Column({default: false})
    existe_empresa: boolean; 

  //  @JoinColumn({name:'empleadores_id'})
    @OneToMany(type => Vacante, vacante => vacante.empleador)  
    vacante: Vacante[];

    @OneToOne(type => Empresa, empresa => empresa.empleador, {eager: true})
    empresa: Empresa;
    
}