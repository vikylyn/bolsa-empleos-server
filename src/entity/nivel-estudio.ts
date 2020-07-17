import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';


@Entity('nivel_estudio')
export class NivelEstudio {
   
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({type: 'varchar', length: 45,unique: true})
    nombre: string;   
}
