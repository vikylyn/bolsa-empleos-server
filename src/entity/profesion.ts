import {Entity, Column, PrimaryGeneratedColumn,JoinColumn, ManyToOne} from 'typeorm';
import { Administrador } from './administrador';
import { AreaLaboral } from './area-laboral';

@Entity('profesiones')
export class Profesion {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 30,unique: true})
    nombre: string;
    
    @Column()
    habilitado: boolean;

    @JoinColumn({name:'areas_laborales_id'})
    @ManyToOne(type => AreaLaboral, area => area.id,{nullable: false})
    area_laboral: AreaLaboral;
  
    @JoinColumn({name:'administradores_id'})
    @ManyToOne(type => Administrador, administrador => administrador.id)
    administrador: Administrador 

}
