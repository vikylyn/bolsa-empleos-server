import {Entity, Column, PrimaryGeneratedColumn,JoinColumn, ManyToOne} from 'typeorm';
import { Administrador } from './administrador';
import { GrupoOcupacional } from './grupo-ocupacional';

@Entity('ocupaciones')
export class Ocupacion {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 100,unique: true})
    nombre: string;
      
    @Column()
    habilitado: boolean; 

    @JoinColumn({name:'grupos_ocupacionales_id'})
    @ManyToOne(type => GrupoOcupacional, grupo => grupo.id,{nullable: false,eager: true})
    grupo_ocupacional: GrupoOcupacional;
  
    @JoinColumn({name:'administradores_id'})
    @ManyToOne(type => Administrador, administrador => administrador.id,{nullable: false,eager: true})
    administrador: Administrador;
}
