import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';


@Entity('periodos_de_pago')
export class PeriodoPago {
   
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({type: 'varchar', length: 20,unique: true})
    periodo: string;   
}
