import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Administrador } from './administrador';

@Entity('grupos_ocupacionales')
export class GrupoOcupacional {
   
    @PrimaryGeneratedColumn()
    id: number;  

    @Column({type: 'varchar', length: 150,unique: true, nullable: false})
    nombre: string;

  //  @Column({type: 'varchar', length: 10,unique: true, nullable: false})
 //   codigo: string;

    @Column()
    habilitado: boolean;
  
    @JoinColumn({name:'administradores_id'})
    @ManyToOne(type => Administrador, administrador => administrador.id,{nullable: false})
    administrador: Administrador;

} 
