import { Entity,PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, Index } from 'typeorm';
import { Curriculum } from './curriculum';
import { Habilidad } from './habilidad';

@Entity('curriculums_habilidades')
@Index(["curriculum", "habilidad"], { unique: true })
export class CurriculumHabilidad {

    @PrimaryGeneratedColumn()
    id: number;

    @JoinColumn({name:'curriculums_id'})
    @ManyToOne(type => Curriculum, curriculum => curriculum.id,{nullable: false})
    curriculum: Curriculum;

    @JoinColumn({name:'habilidades_id'})
    @ManyToOne(type => Habilidad, habilidad => habilidad.id,{nullable: false, eager: true})
    habilidad: Habilidad;
 
}



