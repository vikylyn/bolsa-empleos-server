import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';

import { Estado } from './estado';


@Entity('ciudades')
export class Ciudad {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({type: 'varchar', length: 30})
    nombre: string;
 
  
    @JoinColumn({name:'estados_id'})
    @ManyToOne(type => Estado, estado => estado.id, {nullable: false, eager: true})  
    pais: Estado 
 
}