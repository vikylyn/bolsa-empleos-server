import { Usuario } from './usuario';
import { Entity, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Ciudad } from './ciudad';
import { Vacante } from './vacante';



@Entity('empleadores')
export class Empleador extends Usuario {
    @Column({type: 'varchar', length: 20})
    nacionalidad: string;

    @Column({type: 'varchar', length: 45})
    direccion: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    creado_en: Date;

    @JoinColumn({name:'ciudades_id'})
    @ManyToOne(type => Ciudad, ciudad => ciudad.id, {nullable: false, eager: true})  
    ciudad: Ciudad

  //  @JoinColumn({name:'empleadores_id'})
    @OneToMany(type => Vacante, vacante => vacante.empleador)  
    vacante: Vacante[]
}