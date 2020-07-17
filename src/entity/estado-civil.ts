import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';


@Entity('estado_civil')
export class EstadoCivil {
   
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({type: 'varchar', length: 20,unique: true})
    estado: string;   

}
