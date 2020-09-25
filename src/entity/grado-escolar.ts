import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { NivelEscolar } from './nivel-escolar';


@Entity('grados_escolares')
@Index(["grado", "nivel_escolar"], { unique: true })
export class GradoEscolar{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 30})
    grado: string;

    @JoinColumn({name:'niveles_escolares_id'}) 
    @ManyToOne(type => NivelEscolar, nivel => nivel.id, {nullable: false, eager: true})  
    nivel_escolar: NivelEscolar;

}
