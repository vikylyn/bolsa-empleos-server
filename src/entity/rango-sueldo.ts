import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';



@Entity('sueldos')
export class RangoSueldo {
   
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({type: 'varchar', length: 30,unique: true})
    sueldo: string; 

}
  