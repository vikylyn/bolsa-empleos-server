import {Entity, Column, PrimaryGeneratedColumn,JoinColumn, ManyToOne, OneToOne} from 'typeorm';
import { Curriculum } from './curriculum';
import { Pais } from './pais';
import { GradoEscolar } from './grado-escolar';
import { Ciudad } from './ciudad';
import { OtraCiudadEBasico } from './OtraCiudadEstudioBasico';

@Entity('estudios_basicos')
export class EstudioBasico {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 45})
    colegio: string;

    @Column({type: 'date'})
    fecha_inicio: Date;

    @Column({type: 'date'})
    fecha_fin: Date;

    @JoinColumn({name:'curriculums_id'})
    @ManyToOne(type => Curriculum, curriculum => curriculum.id,{nullable:false})
    curriculum: Curriculum;

    @JoinColumn({name:'grado_inicio'}) 
    @ManyToOne(type => GradoEscolar, grado => grado.id,{nullable:false, eager: true})
    grado_inicio: GradoEscolar;

    @JoinColumn({name:'grado_fin'})
    @ManyToOne(type => GradoEscolar, grado => grado.id,{nullable:false, eager: true})
    grado_fin: GradoEscolar;

    @JoinColumn({name:'ciudades_id'})
    @ManyToOne(type => Ciudad, ciudad => ciudad.id, {nullable: false, eager: true})  
    ciudad: Ciudad;

    @OneToOne(type => OtraCiudadEBasico, ciudad => ciudad.estudio, {eager: true})
    otraCiudad: OtraCiudadEBasico;
}