import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Curriculum } from './curriculum';
import { Pais } from './pais';
import { GrupoOcupacional } from './grupo-ocupacional';
import { TipoContrato } from './tipo-contrato';
import { OtraCiudadExperienciaLaboral } from './OtraCiudadExperienciaLaboral';
import { Ciudad } from './ciudad';

 
@Entity('experiencias_laborales')
export class ExperienciaLaboral {

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

    @JoinColumn({name:'tipo_contrato_id'})
    @ManyToOne(type => TipoContrato, tipo => tipo.id,{nullable:false, eager: true})
    tipo_contrato: TipoContrato;

    @JoinColumn({name:'curriculums_id'})
    @ManyToOne(type => Curriculum, curriculum => curriculum.id,{nullable:false})
    curriculum: Curriculum;

    @JoinColumn({name:'ciudades_id'})
    @ManyToOne(type => Ciudad, ciudad => ciudad.id, {nullable: false, eager: true})  
    ciudad: Ciudad;

    @OneToOne(type => OtraCiudadExperienciaLaboral, ciudad => ciudad.experiencia, {eager: true})
    otraCiudad: OtraCiudadExperienciaLaboral; 

}