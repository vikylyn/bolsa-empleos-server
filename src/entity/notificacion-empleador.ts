import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Empleador } from './empleador';
import { Solicitante } from './solicitante';
import { TipoNotificacion } from './tipo_notificacion';
import { Vacante } from './vacante';


@Entity('notificaciones_empleadores')
export class NotificacionEmpleador {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    leido: boolean;
    
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    creado_en: Date;



    @JoinColumn({name:'solicitantes_id'}) 
    @ManyToOne(type => Solicitante, solicitante => solicitante.id, {nullable: false, eager: true})  
    solicitante: Solicitante;

    @JoinColumn({name:'empleadores_id'})
    @ManyToOne(type => Empleador, empleador => empleador.id,{nullable:false, eager: true})
    empleador: Empleador;

    @JoinColumn({name:'vacantes_id'}) 
    @ManyToOne(type => Vacante, vacante => vacante.id, {nullable: false, eager: true})  
    vacante: Vacante;

    @JoinColumn({name:'tipo_notificacion_id'}) 
    @ManyToOne(type => TipoNotificacion, tipo_notificacion => tipo_notificacion.id, {nullable: false, eager: true})  
    tipo_notificacion: TipoNotificacion;
 
}