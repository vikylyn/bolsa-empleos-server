insert into idiomas(id,nombre) values(1,'Español');
insert into idiomas(id,nombre) values(2,'Ingles');
insert into idiomas(id,nombre) values(3,'Quechua');
insert into idiomas(id,nombre) values(4,'Aymara');
insert into idiomas(id,nombre) values(5,'Guarani');

insert into niveles_idioma(id,nombre) values(1,'Alto');
insert into niveles_idioma(id,nombre) values(2,'Medio');
insert into niveles_idioma(id,nombre) values(3,'Bajo');

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

insert into niveles_estudio(nombre) values('Tecnico Medio');
insert into niveles_estudio(nombre) values('Tecnico Superior');
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

insert into habilidades(habilidad) values('Proactividad');
insert into habilidades(habilidad) values('Liderazgo');
insert into habilidades(habilidad) values('Resolución de problemas');
insert into habilidades(habilidad) values('Capacidad de trabajo en equipo');
insert into habilidades(habilidad) values('Compromiso');
insert into habilidades(habilidad) values('Autoconfianza y optimismo');
insert into habilidades(habilidad) values('Autonomía');
insert into habilidades(habilidad) values('Capacidad de comunicación');
insert into habilidades(habilidad) values('Asertividad');
insert into habilidades(habilidad) values('Capacidad de adaptación');
insert into habilidades(habilidad) values('Negociación');
insert into habilidades(habilidad) values('Control del estrés');
insert into habilidades(habilidad) values('Racionalización');
insert into habilidades(habilidad) values('Innovación y creatividad');
insert into habilidades(habilidad) values('Iniciativa y toma de decisiones');


insert into tipo_contrato(tipo) values('Tiempo Indefinido');
insert into tipo_contrato(tipo) values('Plazo fijo');
insert into tipo_contrato(tipo) values('Practica o Pasantia');
insert into tipo_contrato(tipo) values('Por Temporada');
insert into tipo_contrato(tipo) values('Obra o servicio');

insert into horarios(nombre) values('Diurno');
insert into horarios(nombre) values('Nocturno');
insert into horarios(nombre) values('Continuo');
insert into horarios(nombre) values('Extraordinario');
insert into horarios(nombre) values('otro');

insert into tipo_jornada(id,tipo) values(1,'Tiempo Completo');
insert into tipo_jornada(id,tipo) values(2,'Medio Tiempo');
insert into tipo_jornada(id,tipo) values(3,'Por Horas');
/*
insert into horarios(nombre) values('Diurno');
insert into horarios(nombre) values('Nocturno');
insert into horarios(nombre) values('Ordinario');
insert into horarios(nombre) values('Extraordinario');
insert into horarios(nombre) values('Continuo');
insert into horarios(nombre) values('Discontinuo');
insert into horarios(nombre) values('otro');

insert into tipo_jornada(id,tipo) values(1,'Tiempo Completo');
insert into tipo_jornada(id,tipo) values(2,'Medio Tiempo');
insert into tipo_jornada(id,tipo) values(3,'Desde Casa');
insert into tipo_jornada(id,tipo) values(4,'Por Horas');
*/
insert into tipo_notificacion(id,tipo,descripcion) values(1,'nueva_postulacion','Notificacion enviada al empleador cuando hay un nuevo postulante para su vacante');
insert into tipo_notificacion(id,tipo,descripcion) values(2,'postulacion_aceptada', 'Notificacion enviada al solicitante cuando el empleador acepta su postulacion pero todavia no es un contrato');
insert into tipo_notificacion(id,tipo,descripcion) values(3, 'postulacion_rechazada_empleador', 'Notificacion enviada al solicitante cuando el empleador no acepta su postulacion');
insert into tipo_notificacion(id,tipo,descripcion) values(4, 'desvinculacion_solicitante', 'Notificacion enviada al solicitante cuando es desvinculado de una contratacion');
insert into tipo_notificacion(id,tipo,descripcion) values(5, 'postulacion_confirmada', 'Notificacion enviada al empleador cuando el solicitante confirma la postulacion y pasa a ser un contrato');
insert into tipo_notificacion(id,tipo,descripcion) values(6, 'postulacion_rechazada_solicitante', 'Notificacion enviada al empleador cuando el solicitante rechaza la postulacion');
insert into tipo_notificacion(id,tipo,descripcion) values(7, 'invitacion_postulacion', 'Notificacion enviada al solicitante para que postule a un vacante');

insert into razon_social(id,tipo,sigla) values(1,'Empresa Unipersonal','Empresa Unipersonal');
insert into razon_social(id,tipo,sigla) values(2,'Sociedad de Responsabilidad Limitada','S.R.L.');
insert into razon_social(id,tipo,sigla) values(3,'Sociedad Anónima','S.A.');
insert into razon_social(id,tipo,sigla) values(4,'Sucursal de sociedad constituida en el extranjero','S.C.E');
insert into razon_social(id,tipo,sigla) values(5,'Sociedad Anónima Mixta','S.A.M.');
insert into razon_social(id,tipo,sigla) values(6,'Sociedad Colectiva','S.C');
insert into razon_social(id,tipo,sigla) values(7,'Sociedad en Comandita Simple','S.C.S.');
insert into razon_social(id,tipo,sigla) values(8,'Sociedad en Comandita por Acciones','S.C.A');

insert into periodos_de_pago(id,periodo) values(1,'Por hora');
insert into periodos_de_pago(id,periodo) values(2,'Por dia');
insert into periodos_de_pago(id,periodo) values(3,'Por semana');
insert into periodos_de_pago(id,periodo) values(4,'Por quincena');
insert into periodos_de_pago(id,periodo) values(5,'Por mes');

insert into periodos_de_pago(id,periodo) values(1,'Por hora');
insert into periodos_de_pago(id,periodo) values(2,'Por dia');
insert into periodos_de_pago(id,periodo) values(3,'Por semana');
insert into periodos_de_pago(id,periodo) values(4,'Por quincena');
insert into periodos_de_pago(id,periodo) values(5,'Por mes');

insert into imagenes(id,id_cloudinary,formato,url,url_segura) values(1,'no-image2_uyivib','png','http://res.cloudinary.com/dl8ifr7sr/image/upload/v1595442138/no-image2_uyivib.png','https://res.cloudinary.com/dl8ifr7sr/image/upload/v1595442138/no-image2_uyivib.png');

insert into informacion_app(id,nombre,eslogan,descripcion,telefono,email,direccion,imagenes_id,ciudades_id) values(1,'JOBBO','JOBS IN BOLIVIA','Brindamos una alternativa para encontrar tu empleo ideal','75120011','fernandezvirgilio05@gmail.com','Barrio 101 familias Pje. La Cruz # 2179',1,12);
