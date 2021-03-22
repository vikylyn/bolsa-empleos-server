insert into idiomas(nombre) values('Español');
insert into idiomas(nombre) values('Ingles');
insert into idiomas(nombre) values('Quechua');
insert into idiomas(nombre) values('Aymara');
insert into idiomas(nombre) values('Guarani');

insert into niveles_idioma(nombre) values('Alto');
insert into niveles_idioma(nombre) values('Medio');
insert into niveles_idioma(nombre) values('Bajo');

insert into roles(id,nombre) values(1,'ROLE_ADMINISTRADOR');
insert into roles(id,nombre) values(2,'ROLE_SOLICITANTE');
insert into roles(id,nombre) values(3,'ROLE_EMPLEADOR');

INSERT INTO paises(nombre) values('Bolivia');
insert into paises(id, nombre) values (2, 'Otro');
insert into estados(id, nombre, paises_id) values(10, 'Otro', 2);
insert into ciudades(id, nombre, estados_id) values(203, 'Otro', 10);


insert into estado_civil(estado) values('Casado');
insert into estado_civil(estado) values('Soltero');
insert into estado_civil(estado) values('Divorciado');
insert into estado_civil(estado) values('Viudo');

insert into niveles_estudio(nombre) values('Tecnico');
insert into niveles_estudio(nombre) values('Tecnico Medio');
insert into niveles_estudio(nombre) values('Tecnico Avanzado');
insert into niveles_estudio(nombre) values('Egresado');
insert into niveles_estudio(nombre) values('Licenciatura');
insert into niveles_estudio(nombre) values('PostGrado');
insert into niveles_estudio(nombre) values('Maestria');
insert into niveles_estudio(nombre) values('Doctorado');
insert into niveles_estudio(nombre) values('Curso');
insert into niveles_estudio(nombre) values('Seminario');
insert into niveles_estudio(nombre) values('Congreso');
insert into niveles_estudio(nombre) values('Taller');
insert into niveles_estudio(nombre) values('Diplomado');
insert into niveles_estudio(nombre) values('Abandonado');
insert into niveles_estudio(nombre) values('Congelado');
insert into niveles_estudio(nombre) values('Cursando Actualmente');
insert into niveles_estudio(nombre) values('Otro');

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


insert into tipo_contrato(tipo) values('Tiempo Completo');
insert into tipo_contrato(tipo) values('Medio Tiempo');
insert into tipo_contrato(tipo) values('Practica o Pasantia');
insert into tipo_contrato(tipo) values('Temporal');
insert into tipo_contrato(tipo) values('Obra o servicio');


insert into horarios(nombre) values('Diurno');
insert into horarios(nombre) values('Nocturno');
insert into horarios(nombre) values('Mañana');
insert into horarios(nombre) values('Tarde');
insert into horarios(nombre) values('otros');

insert into tipo_notificacion(id,tipo,descripcion) values(1,'nueva_postulacion','Notificacion enviada al empleador cuando hay un nuevo postulante para su vacante');
insert into tipo_notificacion(id,tipo,descripcion) values(2,'postulacion_aceptada', 'Notificacion enviada al solicitante cuando el empleador acepta su postulacion pero todavia no es un contrato');
insert into tipo_notificacion(id,tipo,descripcion) values(3, 'postulacion_rechazada_empleador', 'Notificacion enviada al solicitante cuando el empleador no acepta su postulacion');
insert into tipo_notificacion(id,tipo,descripcion) values(4, 'desvinculacion_solicitante', 'Notificacion enviada al solicitante cuando es desvinculado de una contratacion');
insert into tipo_notificacion(id,tipo,descripcion) values(5, 'postulacion_confirmada', 'Notificacion enviada al empleador cuando el solicitante confirma la postulacion y pasa a ser un contrato');
insert into tipo_notificacion(id,tipo,descripcion) values(6, 'postulacion_rechazada_solicitante', 'Notificacion enviada al empleador cuando el solicitante rechaza la postulacion');
insert into tipo_notificacion(id,tipo,descripcion) values(7, 'invitacion_postulacion', 'Notificacion enviada al solicitante para que postule a un vacante');


insert into imagenes(id,id_cloudinary,formato,url,url_segura) values(43,'no-image2_uyivib','png','http://res.cloudinary.com/dl8ifr7sr/image/upload/v1595442138/no-image2_uyivib.png','https://res.cloudinary.com/dl8ifr7sr/image/upload/v1595442138/no-image2_uyivib.png');
insert into informacion_app(id,nombre,eslogan,descripcion,telefono,email,direccion,imagenes_id,ciudades_id) values(1,'JOBBO','JOBS IN BOLIVIA','Brindamos una alternativa para encontrar tu empleo ideal','75120011','fernandezvirgilio05@gmail.com','Barrio 101 familias Pje. La Cruz # 2179',43,12);