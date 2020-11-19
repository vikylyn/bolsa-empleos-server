insert into idiomas(nombre) values('Español');
insert into idiomas(nombre) values('Ingles');
insert into idiomas(nombre) values('Quechua');
insert into idiomas(nombre) values('Aymara');
insert into idiomas(nombre) values('Guarani');

insert into nivel_idioma(nombre) values('Alto');
insert into nivel_idioma(nombre) values('Medio');
insert into nivel_idioma(nombre) values('Bajo');
insert into nivel_idioma(nombre) values('Nativo');

insert into roles(id,nombre) values(1,'ROLE_ADMINISTRADOR');
insert into roles(id,nombre) values(2,'ROLE_SOLICITANTE');
insert into roles(id,nombre) values(3,'ROLE_EMPLEADOR');

INSERT INTO paises(nombre) values('Bolivia');


insert into actividades_laborales(id,nombre) values(1,'Profesion');
insert into actividades_laborales(id,nombre) values(2,'Oficio');

insert into estado_civil(estado) values('Casado');
insert into estado_civil(estado) values('Soltero');
insert into estado_civil(estado) values('Divorciado');
insert into estado_civil(estado) values('Viudo');

insert into nivel_estudio(nombre) values('Tecnico');
insert into nivel_estudio(nombre) values('Tecnico Medio');
insert into nivel_estudio(nombre) values('Tecnico Avanzado');
insert into nivel_estudio(nombre) values('Egresado');
insert into nivel_estudio(nombre) values('Licenciatura');
insert into nivel_estudio(nombre) values('PostGrado');
insert into nivel_estudio(nombre) values('Maestria');
insert into nivel_estudio(nombre) values('Doctorado');
insert into nivel_estudio(nombre) values('Curso');
insert into nivel_estudio(nombre) values('Seminario');
insert into nivel_estudio(nombre) values('Congreso');
insert into nivel_estudio(nombre) values('Taller');
insert into nivel_estudio(nombre) values('Diplomado');
insert into nivel_estudio(nombre) values('Abandonado');
insert into nivel_estudio(nombre) values('Congelado');
insert into nivel_estudio(nombre) values('Cursando Actualmente');
insert into nivel_estudio(nombre) values('Otro');
/*
insert into niveles_escolares(nivel) values('Preescolar');
insert into niveles_escolares(nivel) values('Primaria');
insert into niveles_escolares(nivel) values('Secundaria');
*/
insert into habilidades(habilidad) values('Empatía');
insert into habilidades(habilidad) values('Liderazgo');
insert into habilidades(habilidad) values('Flexibilidad');
insert into habilidades(habilidad) values('Capacidad de trabajo en equipo');
insert into habilidades(habilidad) values('Escucha activa');
insert into habilidades(habilidad) values('Autoconfianza y optimismo');
insert into habilidades(habilidad) values('Persuasión');
insert into habilidades(habilidad) values('Capacidad de comunicación');
insert into habilidades(habilidad) values('Trabajo en equipo');
insert into habilidades(habilidad) values('Capacidad de adaptación');
insert into habilidades(habilidad) values('Negociación');
insert into habilidades(habilidad) values('Control del estrés');
insert into habilidades(habilidad) values('Racionalización');
insert into habilidades(habilidad) values('Innovación y creatividad');
insert into habilidades(habilidad) values('Iniciativa y toma de decisiones');

/*
insert into grados_escolares(grado,niveles_escolares_id) values('Primero',2);
insert into grados_escolares(grado,niveles_escolares_id) values('Segundo',2);
insert into grados_escolares(grado,niveles_escolares_id) values('Tercero',2);
*/
insert into tipo_contrato(tipo) values('Tiempo Completo');
insert into tipo_contrato(tipo) values('Medio Tiempo');
insert into tipo_contrato(tipo) values('Practica o Pasantia');
insert into tipo_contrato(tipo) values('Temporal');
insert into tipo_contrato(tipo) values('Obra o servicio');


insert into horarios(nombre) values('Diurno');
insert into horarios(nombre) values('Nocturno');
insert into horarios(nombre) values('Mañana');
insert into horarios(nombre) values('Tarde');
/*
insert into sueldos(sueldo) values('De bs. 2122 a bs. 2500');
insert into sueldos(sueldo) values('De bs. 2500 a bs. 3000');
insert into sueldos(sueldo) values('De bs. 3000 a bs. 3500');
insert into sueldos(sueldo) values('De bs. 3500 a bs. 4000');
insert into sueldos(sueldo) values('De bs. 4000 a bs. 4500');
insert into sueldos(sueldo) values('De bs. 4500 a bs. 5000');
insert into sueldos(sueldo) values('De bs. 5000 a bs. 5500');
insert into sueldos(sueldo) values('De bs. 5500 a bs. 6500');
insert into sueldos(sueldo) values('De bs. 6500 a bs. 7000');
insert into sueldos(sueldo) values('De bs. 7000 a bs. 7500');
insert into sueldos(sueldo) values('De bs. 7500 a bs. 8000');
insert into sueldos(sueldo) values('De bs. 8000 a bs. 8500');
insert into sueldos(sueldo) values('De bs. 8500 a bs. 9000');
insert into sueldos(sueldo) values('De bs. 9000 a bs. 9500');
insert into sueldos(sueldo) values('De bs. 9500 a bs. 10000');
insert into sueldos(sueldo) values('De bs. 10000 a bs. 10500');
insert into sueldos(sueldo) values('De bs. 10500 a bs. 11000');
insert into sueldos(sueldo) values('De bs. 11000 a bs. 11500');
insert into sueldos(sueldo) values('De bs. 11500 a bs. 12000');
insert into sueldos(sueldo) values('De bs. 12000 a bs. 12500');
insert into sueldos(sueldo) values('De bs. 12500 a bs. 13000');
insert into sueldos(sueldo) values('De bs. 13000 a bs. 13500');
insert into sueldos(sueldo) values('De bs. 13500 a bs. 14000');
insert into sueldos(sueldo) values('De bs. 14000 a bs. 14500');
insert into sueldos(sueldo) values('De bs. 14500 a bs. 15000');
insert into sueldos(sueldo) values('Mayor a bs. 15000');
insert into sueldos(sueldo) values('No declarado');
insert into sueldos(sueldo) values('Negociable');
*/

insert into tipo_notificacion(id,tipo,descripcion) values(1,'nueva_postulacion','Notificacion enviada al empleador cuando hay un nuevo postulante para su vacante');
insert into tipo_notificacion(id,tipo,descripcion) values(2,'postulacion_aceptada', 'Notificacion enviada al solicitante cuando el empleador acepta su postulacion pero todavia no es un contrato');
insert into tipo_notificacion(id,tipo,descripcion) values(3, 'postulacion_rechazada_empleador', 'Notificacion enviada al solicitante cuando el empleador no acepta su postulacion');
insert into tipo_notificacion(id,tipo,descripcion) values(4, 'desvinculacion_solicitante', 'Notificacion enviada al solicitante cuando es desvinculado de una contratacion');
insert into tipo_notificacion(id,tipo,descripcion) values(5, 'postulacion_confirmada', 'Notificacion enviada al empleador cuando el solicitante confirma la postulacion y pasa a ser un contrato');
insert into tipo_notificacion(id,tipo,descripcion) values(6, 'postulacion_rechazada_solicitante', 'Notificacion enviada al empleador cuando el solicitante rechaza la postulacion');


select * from idiomas;
select * from nivel_idioma;
delete from curriculums_habilidades where id>0;
delete from experiencias_laborales where id>0;
delete from referencias where id>0;
delete from estudios_avanzados where id>0;
delete from estudios_basicos where id>0;
delete from curriculums_idiomas where id>0;
delete from curriculums where id>0;
delete from solicitantes where id>0;
delete from credenciales where roles_id = 3;
delete from imagenes where id>1;

delete from empresas where id>0;
delete from empleadores where id>0;

select * from credenciales;
select * from solicitantes;
select * from administradores;
select * from empleadores;
select * from empresas;