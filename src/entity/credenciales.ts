import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Rol } from './rol';


@Entity('credenciales')
export class Credenciales {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({type: 'varchar', length: 50,unique: true})
    email: string;
    
    @Column({type: 'varchar', length: 100})
    password: string;  
  
    @JoinColumn({name:'roles_id'}) 
    @ManyToOne(type => Rol, rol => rol.id, {nullable: false, eager: true})  
    rol: Rol
 
}