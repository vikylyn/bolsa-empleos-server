import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne } from 'typeorm';
import { EstudioAvanzado } from './estudio-avanzado';

@Entity('otra_ciudad_e_avanzados')
export class OtraCiudadEAvanzado {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar',length: 20})
    pais: string;

    @Column({type: 'varchar',length: 20})
    estado: string;

    @Column({type: 'varchar',length: 20})
    ciudad: string;

    @JoinColumn({name:'estudio_id'})
    @OneToOne(type => EstudioAvanzado, estudio => estudio.id, {nullable:false})
    estudio: EstudioAvanzado;
}