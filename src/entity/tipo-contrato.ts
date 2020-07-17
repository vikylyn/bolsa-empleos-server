import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';


@Entity('tipo_contrato')
export class TipoContrato {
   
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({type: 'varchar', length: 20,unique: true})
    tipo: string;   

}
