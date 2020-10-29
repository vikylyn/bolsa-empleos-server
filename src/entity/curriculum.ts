import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToOne, OneToMany } from 'typeorm';
import { Solicitante } from './solicitante';
import { CurriculumIdioma } from './curriculum-idioma';
import { Habilidad } from './habilidad';
import { EstudioBasico } from './estudio-basico';
import { Referencia } from './referencia';
import { CurriculumHabilidad } from './curriculum-habilidad';
import { EstudioAvanzado } from './estudio-avanzado';
import { ExperienciaLaboral } from './experiencia-laboral';


@Entity('curriculums')
export class Curriculum {  

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 45})
    titulo: string;
    
    @Column()
    pretension_salarial: number;

    @Column({type: 'varchar', length: 500})
    biografia: string; 
      
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    creado_en: Date;
  
    @OneToMany(type => ExperienciaLaboral, experiencias => experiencias.curriculum)
    experiencias_laborales: ExperienciaLaboral[];

    @OneToMany(type => CurriculumHabilidad, curriculum_habilidad => curriculum_habilidad.curriculum)
    curriculum_habilidades: Habilidad[];

    @OneToMany(type => EstudioBasico, estudios_basicos => estudios_basicos.curriculum)
    estudios_basicos: EstudioBasico[];
  
    @OneToMany(type => EstudioAvanzado, estudios_avanzados => estudios_avanzados.curriculum)
    estudios_avanzados: EstudioAvanzado[];

    @OneToMany(type => Referencia, referencia => referencia.curriculum)
    referencias: Referencia[];

    @OneToMany(type => CurriculumIdioma, curriculum_idioma => curriculum_idioma.curriculum)
    curriculum_idiomas: CurriculumIdioma[];

    @JoinColumn({name:'solicitantes_id'}) 
    @OneToOne(type => Solicitante, solicitante => solicitante.id, {nullable: false, eager: true})  
    solicitante: Solicitante;
 
}