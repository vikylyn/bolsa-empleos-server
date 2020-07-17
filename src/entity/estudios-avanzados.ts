import {Entity, Column, PrimaryGeneratedColumn,JoinColumn, ManyToOne} from 'typeorm';
import { Curriculum } from './curriculum';
import { Pais } from './pais';
import { NivelEstudio } from './nivel-estudio';

@Entity('estudios_avanzados')
export class EstudiosAvanzados {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 45})
    institucion: string;

    @Column({type: 'varchar', length: 30})
    carrera: string;

    @Column({type: 'date'})
    fecha_inicio: Date;

    @Column({type: 'date'})
    fecha_fin: Date;

    @Column({type: 'varchar', length: 20})
    estado: string;

    @Column({type: 'varchar', length: 20})
    ciudad: string;

    @JoinColumn({name:'curriculums_id'})
    @ManyToOne(type => Curriculum, curriculum => curriculum.id,{nullable:false})
    curriculum: Curriculum;

    @JoinColumn({name:'paises_id'})
    @ManyToOne(type => Pais, pais => pais.id,{nullable:false, eager: true})
    pais: Pais;

    @JoinColumn({name:'niveles_estudio_id'})
    @ManyToOne(type => NivelEstudio, nivel_estudio => nivel_estudio.id,{nullable:false, eager: true})
    nivel_estudio: NivelEstudio;

}