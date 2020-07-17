import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';


@Entity('tipo_notificacion')
export class TipoNotificacion {
   
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({type: 'varchar', length: 20,unique: true})
    tipo: string;   

}
