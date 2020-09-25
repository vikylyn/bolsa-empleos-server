import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';



@Entity('idiomas')
export class Idioma {
   
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({type: 'varchar', length: 20,unique: true})
    nombre: string; 

}
