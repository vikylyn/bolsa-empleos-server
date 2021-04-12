
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Index } from 'typeorm';
import { Solicitante } from './solicitante';
import { Vacante } from './vacante';

@Entity('postulaciones')
@Index(["solicitante", "vacante"], { unique: true })
export class Postulacion {

    @PrimaryGeneratedColumn()
    id: number; 

  
    @JoinColumn({name:'vacantes_id'})
    @ManyToOne(type => Vacante, vacante => vacante.id,{nullable: false, eager: true})
    vacante: Vacante;

    @JoinColumn({name:'solicitantes_id'})
    @ManyToOne(type => Solicitante, solicitante => solicitante.id, {nullable: false, eager: true})
    solicitante: Solicitante;

    @Column({default: false})
    aceptado: boolean;

    @Column({default: false})
    rechazado: boolean;

    @Column({default: false})
    favorito: boolean;
    
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    creado_en: Date;

    @Column({ type: "timestamp", nullable: true})
    rechazado_en: Date;

    @Column({default: false})
    oculto: boolean;

}
