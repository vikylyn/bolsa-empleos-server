import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Administrador } from './administrador';

@Entity('grupos_ocupacionales')
export class GrupoOcupacional {
   
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 100,unique: true})
    nombre: string;
    
    @Column()
    habilitado: boolean;
  
    @JoinColumn({name:'administradores_id'})
    @ManyToOne(type => Administrador, administrador => administrador.id,{nullable: false})
    administrador: Administrador;

} 
