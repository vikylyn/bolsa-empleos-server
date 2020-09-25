import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';



@Entity('horarios')
export class Horario {
   
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({type: 'varchar', length: 30,unique: true})
    nombre: string; 

}
