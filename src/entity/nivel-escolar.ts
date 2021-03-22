import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';


@Entity('niveles_escolares')
export class NivelEscolar{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 30, unique: true})
    nivel: string;

}
