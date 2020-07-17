import { Entity,PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, Index } from 'typeorm';
import { NivelIdioma } from './nivel-idioma';
import { Curriculum } from './curriculum';
import { Idioma } from './idioma';

@Entity('curriculums_idiomas')
@Index(["curriculum", "idioma"], { unique: true })
export class CurriculumIdioma {

    @PrimaryGeneratedColumn()
    id: number;

    @JoinColumn({name:'curriculum_id'})
    @ManyToOne(type => Curriculum, curriculum => curriculum.id,{nullable: false})
    curriculum: Curriculum;

    @JoinColumn({name:'idioma_id'})
    @ManyToOne(type => Idioma, idioma => idioma.id,{nullable: false})
    idioma: Idioma;


    @JoinColumn({name:'nivel_escrito'})
    @ManyToOne(type => NivelIdioma, nivel_idioma => nivel_idioma.id,{nullable: false, eager: true})
    nivel_escrito: NivelIdioma;

    @JoinColumn({name:'nivel_oral'})
    @ManyToOne(type => NivelIdioma, nivel_idioma => nivel_idioma.id,{nullable: false, eager: true})
    nivel_oral: NivelIdioma;

    @JoinColumn({name:'nivel_lectura'})
    @ManyToOne(type => NivelIdioma, nivel_idioma => nivel_idioma.id,{nullable: false, eager: true})
    nivel_lectura: NivelIdioma;
}
