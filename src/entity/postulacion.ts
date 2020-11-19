
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Index } from 'typeorm';
import { Solicitante } from './solicitante';
import { Vacante } from './vacante';

@Entity('postulaciones')
@Index(["solicitante", "vacante"], { unique: true })
export class Postulacion {

    @PrimaryGeneratedColumn()
    id: number; 

  
    @JoinColumn({name:'vacantes_id'})
    @ManyToOne(type => Vacante, vacante => vacante.id,{nullable: false})
    vacante: Vacante;

    @JoinColumn({name:'solicitantes_id'})
    @ManyToOne(type => Solicitante, solicitante => solicitante.id, {nullable: false})
    solicitante: Solicitante;

    @Column()
    aceptado: boolean;

    @Column()
    rechazado: boolean;

    @Column()
    favorito: boolean;
    
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    creado_en: Date;



}
