import {Entity, Column, PrimaryGeneratedColumn,JoinColumn, ManyToOne} from 'typeorm';
import { Administrador } from './administrador';
import { AreaLaboral } from './area-laboral';
import { ActividadLaboral } from './actividad-laboral';

@Entity('profesiones')
export class Profesion {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 100,unique: true})
    nombre: string;
      
    @Column()
    habilitado: boolean; 

    @JoinColumn({name:'areas_laborales_id'})
    @ManyToOne(type => AreaLaboral, area => area.id,{nullable: false,eager: true})
    area_laboral: AreaLaboral;
  
    @JoinColumn({name:'administradores_id'})
    @ManyToOne(type => Administrador, administrador => administrador.id,{nullable: false,eager: true})
    administrador: Administrador;

      
    @JoinColumn({name:'actividades_laborales_id'})
    @ManyToOne(type => ActividadLaboral, actividad => actividad.id,{nullable: false,eager: true})
    actividad_laboral: ActividadLaboral;

}
