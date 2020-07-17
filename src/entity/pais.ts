import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';


@Entity('paises')
export class Pais {
   
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({type: 'varchar', length: 20,unique: true})
    nombre: string;     

}
