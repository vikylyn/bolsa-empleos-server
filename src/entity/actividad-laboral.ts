import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToMany } from 'typeorm';


@Entity('actividades_laborales')
export class ActividadLaboral {
   
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 30,unique: true})
    nombre: string;

}
