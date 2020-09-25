import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';


@Entity('habilidades')
export class Habilidad {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 100})
    habilidad: string;

}
