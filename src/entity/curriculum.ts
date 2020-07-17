import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToOne, OneToMany } from 'typeorm';
import { Solicitante } from './solicitante';
import { CurriculumIdioma } from './curriculum-idioma';
import { Habilidad } from './habilidad';
import { EstudiosBasicos } from './estudios-basicos';
import { EstudiosAvanzados } from './experiencia-laboral';
import { Referencia } from './referencia';


@Entity('curriculums')
export class Curriculum {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 45})
    titulo: string;
    
    @Column()
    pretension_salarial: number;

    @Column({type: 'varchar', length: 255})
    biografia: string; 
      
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    creado_en: Date;
  
    @OneToMany(type => Habilidad, habilidad => habilidad.curriculum)
    habilidades: Habilidad[];

    @OneToMany(type => EstudiosBasicos, estudios_basicos => estudios_basicos.curriculum)
    estudios_basicos: EstudiosBasicos[];

    @OneToMany(type => EstudiosAvanzados, estudios_avanzados => estudios_avanzados.curriculum)
    estudios_avanzados: EstudiosAvanzados[];

    @OneToMany(type => Referencia, referencia => referencia.curriculum)
    referencias: Referencia[];

    @OneToMany(type => CurriculumIdioma, curriculum_idioma => curriculum_idioma.curriculum)
    curriculum_idiomas: CurriculumIdioma[];

    @JoinColumn({name:'solicitantes_id'}) 
    @OneToOne(type => Solicitante, solicitante => solicitante.id, {nullable: false, eager: true})  
    solicitante: Solicitante;
 
}