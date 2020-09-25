import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';


@Entity('imagenes')
export class Imagen {
   
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({type: 'varchar', length: 20})
    id_cloudinary: string;  
    
    @Column({type: 'varchar', length: 10})
    formato: string; 

    @Column({type: 'varchar', length: 100})
    url: string; 
   
    @Column({type: 'varchar', length: 100})
    url_segura: string; 
}
