import {Entity, Column, PrimaryGeneratedColumn,JoinColumn, ManyToOne} from 'typeorm';
import { Curriculum } from './curriculum';
import { Pais } from './pais';
import { AreaLaboral } from './area-laboral';

@Entity('experiencias_laborales')
export class EstudiosAvanzados {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 45})
    empresa: string;

    @Column({type: 'varchar', length: 45})
    puesto: string;

    @Column({type: 'varchar', length: 255})
    descripcion: string;

    @Column({type: 'date'})
    fecha_inicio: Date;

    @Column({type: 'date'})
    fecha_fin: Date;

    @Column({type: 'varchar', length: 20})
    estado: string;

    @Column({type: 'varchar', length: 20})
    ciudad: string;

    @JoinColumn({name:'areas_laborales_id'})
    @ManyToOne(type => AreaLaboral, area_laboral => area_laboral.id,{nullable:false, eager: true})
    area_sector: AreaLaboral;

    @JoinColumn({name:'curriculums_id'})
    @ManyToOne(type => Curriculum, curriculum => curriculum.id,{nullable:false})
    curriculum: Curriculum;

    @JoinColumn({name:'paises_id'})
    @ManyToOne(type => Pais, pais => pais.id,{nullable:false, eager: true})
    pais: Pais;

}