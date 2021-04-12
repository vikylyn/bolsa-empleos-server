import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';


@Entity('tipo_jornada')
export class TipoJornada {
   
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({type: 'varchar', length: 20,unique: true})
    tipo: string;   

}