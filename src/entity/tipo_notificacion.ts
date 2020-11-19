import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';


@Entity('tipo_notificacion')
export class TipoNotificacion {
   
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({type: 'varchar', length: 50,unique: true})
    tipo: string; 
    
    @Column({type: 'varchar', length: 150})
    descripcion: string;  

}
 