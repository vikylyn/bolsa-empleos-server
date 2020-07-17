import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import { CurriculumIdioma } from './curriculum-idioma';


@Entity('idiomas')
export class Idioma {
   
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({type: 'varchar', length: 20,unique: true})
    nombre: string;   

 //   @OneToMany(type => CurriculumIdioma, curriculum_idioma => curriculum_idioma.idioma)
 //   curriculum_idiomas: CurriculumIdioma[];

}
