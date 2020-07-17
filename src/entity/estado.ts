import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Pais } from './pais';


@Entity('estados')
export class Estado {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({type: 'varchar', length: 20})
    nombre: string;
 
  
    @JoinColumn({name:'paises_id'})
    @ManyToOne(type => Pais, pais => pais.id, {nullable: false, eager: true})  
    pais: Pais 
 
}