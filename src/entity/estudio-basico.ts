import {Entity, Column, PrimaryGeneratedColumn,JoinColumn, ManyToOne} from 'typeorm';
import { Curriculum } from './curriculum';
import { Pais } from './pais';
import { GradoEscolar } from './grado-escolar';

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

    @Column({type: 'varchar', length: 20})
    estado: string;

    @Column({type: 'varchar', length: 20})
    ciudad: string;

    @JoinColumn({name:'curriculums_id'})
    @ManyToOne(type => Curriculum, curriculum => curriculum.id,{nullable:false})
    curriculum: Curriculum;

    @JoinColumn({name:'paises_id'})
    @ManyToOne(type => Pais, pais => pais.id,{nullable:false})
    pais: Pais;

    @JoinColumn({name:'grado_inicio'})
    @ManyToOne(type => GradoEscolar, grado => grado.id,{nullable:false})
    grado_inicio: GradoEscolar;

    @JoinColumn({name:'grado_fin'})
    @ManyToOne(type => GradoEscolar, grado => grado.id,{nullable:false})
    grado_fin: GradoEscolar;
}