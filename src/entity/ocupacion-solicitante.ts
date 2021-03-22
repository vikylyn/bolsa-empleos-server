import { Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Solicitante } from './solicitante';
import { Ocupacion } from './ocupacion';

@Entity('ocupaciones_solicitantes')
@Index(["solicitante", "ocupacion"], { unique: true })
export class OcupacionSolicitante {

    @PrimaryGeneratedColumn()
    id: number;

    @JoinColumn({name:'solicitante_id'})
    @ManyToOne(type => Solicitante, solicitante => solicitante.id,{nullable: false})
    solicitante: Solicitante;

    @JoinColumn({name:'ocupacion_id'})
    @ManyToOne(type => Ocupacion, ocupacion => ocupacion.id,{nullable: false, eager: true})
    ocupacion: Ocupacion;

}