import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne,ManyToOne } from 'typeorm';
import { Ciudad } from './ciudad';
import { Imagen } from './imagen';

@Entity('informacion_app')
export class InformacionApp {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 45})
    nombre: string;

    @Column({type: 'varchar', length: 45})
    eslogan: string;

    @Column({type: 'varchar', length: 300})
    descripcion: string;

    @Column({type: 'varchar', length: 50})
    telefono: string;

    @Column({type: 'varchar', length: 50})
    email: string;

    @OneToOne(type => Imagen,{nullable: false, eager: true})
    @JoinColumn({name: 'imagenes_id'})  
    imagen: Imagen;

    @Column({type: 'varchar', length: 60})
    direccion: string;   

    @JoinColumn({name:'ciudades_id'})
    @ManyToOne(type => Ciudad, ciudad => ciudad.id, {nullable: false, eager: true})  
    ciudad: Ciudad;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    creado_en: Date;
    
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    modificado_en: Date;
}