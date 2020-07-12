import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Administrador } from './administrador';
import { Profesion } from './profesion';

@Entity('areas_laborales')
export class AreaLaboral {
   
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 30,unique: true})
    nombre: string;
    
    @Column()
    habilitado: boolean;
  
    @JoinColumn({name:'administradores_id'})
    @ManyToOne(type => Administrador, administrador => administrador.id)
    administrador: Administrador

}
