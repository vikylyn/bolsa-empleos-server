import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne } from 'typeorm';
import { ExperienciaLaboral } from './experiencia-laboral';

@Entity('otra_ciudad_experiencias')
export class OtraCiudadExperienciaLaboral {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 20})
    pais: string;

    @Column({type: 'varchar', length: 20})
    estado: string;

    @Column({type: 'varchar', length: 20})
    ciudad: string;

    @JoinColumn({name:'experiencia_id'})
    @OneToOne(type => ExperienciaLaboral, experiencia => experiencia.id, {nullable:false})
    experiencia: ExperienciaLaboral;
}