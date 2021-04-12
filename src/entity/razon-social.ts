import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';


@Entity('razon_social')
export class RazonSocial {
   
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({type: 'varchar', length: 60,unique: true})
    tipo: string;   

    @Column({type: 'varchar', length: 20,unique: true})
    sigla: string;   
}
