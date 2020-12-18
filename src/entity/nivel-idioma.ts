import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';


@Entity('niveles_idioma')
export class NivelIdioma {
   
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({type: 'varchar', length: 20,unique: true})
    nombre: string;   
}
