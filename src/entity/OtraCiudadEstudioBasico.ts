import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne } from 'typeorm';
import { EstudioBasico } from './estudio-basico';

@Entity('otra_ciudad_e_basicos')
export class OtraCiudadEBasico {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 20})
    pais: string;

    @Column({type: 'varchar', length: 20})
    estado: string;

    @Column({type: 'varchar', length: 20})
    ciudad: string;

    @JoinColumn({name:'estudio_id'})
    @OneToOne(type => EstudioBasico, estudio => estudio.id, {nullable:false})
    estudio: EstudioBasico;
}