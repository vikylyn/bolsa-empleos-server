import { Entity,PrimaryGeneratedColumn, JoinColumn, ManyToOne, Index } from 'typeorm';
import { NivelIdioma } from './nivel-idioma';
import { Idioma } from './idioma';
import { Requisitos } from './requisitos';

@Entity('requisitos_idiomas')
@Index(["requisitos", "idioma"], { unique: true })
export class RequisitosIdioma {

    @PrimaryGeneratedColumn()
    id: number;

    @JoinColumn({name:'requisitos_id'})
    @ManyToOne(type => Requisitos, requisitos => requisitos.id,{nullable: false})
    requisitos: Requisitos;

    @JoinColumn({name:'idioma_id'})
    @ManyToOne(type => Idioma, idioma => idioma.id,{nullable: false, eager: true})
    idioma: Idioma;


    @JoinColumn({name:'nivel_escrito'})
    @ManyToOne(type => NivelIdioma, nivel_idioma => nivel_idioma.id,{nullable: false, eager: true})
    nivel_escrito: NivelIdioma;

    @JoinColumn({name:'nivel_oral'})
    @ManyToOne(type => NivelIdioma, nivel_idioma => nivel_idioma.id,{nullable: false, eager: true})
    nivel_oral: NivelIdioma;

    @JoinColumn({name:'nivel_lectura'})
    @ManyToOne(type => NivelIdioma, nivel_idioma => nivel_idioma.id,{nullable: false, eager: true})
    nivel_lectura: NivelIdioma;
}
