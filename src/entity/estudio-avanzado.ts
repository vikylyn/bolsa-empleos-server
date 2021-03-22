import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Curriculum } from './curriculum';
import { NivelEstudio } from './nivel-estudio';
import { OtraCiudadEAvanzado } from './OtraCiudadEstudioAvanzado';
import { Ciudad } from './ciudad';

@Entity('estudios_avanzados')
export class EstudioAvanzado {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 45})
    institucion: string;

    @Column({type: 'varchar', length: 70})
    carrera: string;

    @Column({type: 'date'})
    fecha_inicio: Date;

    @Column({type: 'date'})
    fecha_fin: Date;

    @JoinColumn({name:'curriculums_id'})
    @ManyToOne(type => Curriculum, curriculum => curriculum.id,{nullable:false})
    curriculum: Curriculum;

    @JoinColumn({name:'ciudades_id'})
    @ManyToOne(type => Ciudad, ciudad => ciudad.id, {nullable: false, eager: true})  
    ciudad: Ciudad;

    @JoinColumn({name:'niveles_estudio_id'})
    @ManyToOne(type => NivelEstudio, nivel_estudio => nivel_estudio.id,{nullable:false, eager: true})
    nivel_estudio: NivelEstudio;
    
    @OneToOne(type => OtraCiudadEAvanzado, ciudad => ciudad.estudio, {eager: true})
    otraCiudad: OtraCiudadEAvanzado; 
}