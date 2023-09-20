-- Active: 1694994035989@@dpg-ck0g4m36fquc73dn3cug-a.oregon-postgres.render.com@5432@base_imagen_dental

create database clinica_dental;

drop table if EXISTS tbl_roles cascade;

CREATE TABLE
    tbl_roles (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL,
        activo BOOLEAN DEFAULT true,
        fecha_borrado TIMESTAMP
    );

drop table if EXISTS tbl_usuarios cascade;

CREATE TABLE
    tbl_usuarios (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        telefono VARCHAR(15),
        password VARCHAR(255) NOT NULL,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        estado BOOLEAN DEFAULT TRUE,
        fecha_borra TIMESTAMP,
        rol_id INTEGER NOT NULL REFERENCES tbl_roles(id)
    );

drop table if EXISTS tbl_tokens cascade;

CREATE TABLE
    tbl_tokens (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER NOT NULL REFERENCES tbl_usuarios(id),
        token VARCHAR(255) NOT NULL,
        fecha_inicio TIMESTAMP NOT NULL,
        fecha_expiracion TIMESTAMP NOT NULL
    );

drop table if EXISTS tbl_especialidades cascade;

CREATE TABLE
    tbl_especialidades (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL,
        activo BOOLEAN DEFAULT true,
        fecha_borrado TIMESTAMP
    );

drop table if EXISTS tbl_doctores cascade;

CREATE TABLE
    tbl_doctores (
        id SERIAL PRIMARY KEY,
        estado BOOLEAN DEFAULT TRUE,
        fecha_borrado TIMESTAMP,
        color VARCHAR(7),
        nombre VARCHAR(500),
        correo_electronico VARCHAR(1000)
    );

drop table if EXISTS tbl_doctor_especialidades;

CREATE TABLE
    tbl_doctor_especialidades (
         id SERIAL PRIMARY KEY,
        doctor_id INTEGER NOT NULL,
        especialidad_id INTEGER NOT NULL,
        estado BOOLEAN DEFAULT TRUE,
        fecha_borrado TIMESTAMP,
        FOREIGN KEY (doctor_id) REFERENCES tbl_doctores(id),
        FOREIGN KEY (especialidad_id) REFERENCES tbl_especialidades(id)
    );

drop table if EXISTS tbl_pacientes cascade;

CREATE TABLE
    tbl_pacientes (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        telefono VARCHAR(15) NOT NULL,
        email VARCHAR(100),
        fecha_nacimiento DATE,
        estado BOOLEAN DEFAULT TRUE,
        fecha_borrado TIMESTAMP
    );

drop table if EXISTS tbl_estados_cita cascade;

CREATE TABLE
    tbl_estados_cita (
        id SERIAL PRIMARY KEY,
        estado VARCHAR(50) NOT NULL,
        activo BOOLEAN DEFAULT TRUE,
        fecha_borrado TIMESTAMP
    );

drop table if EXISTS tbl_citas CASCADE;

CREATE TABLE
    tbl_citas (
        id SERIAL PRIMARY KEY,
        fecha_hora TIMESTAMP NOT NULL,
        doctor_id INTEGER NOT NULL REFERENCES tbl_doctores(id),
        paciente_id INTEGER NOT NULL REFERENCES tbl_pacientes(id),
        estado_id INTEGER NOT NULL REFERENCES tbl_estados_cita(id),
        google_calendar_event_id VARCHAR(255),
        ubicacion VARCHAR(255),
        descripcion TEXT,
        notas TEXT,
        estado BOOLEAN DEFAULT TRUE,
        fecha_borrado TIMESTAMP
    );

drop table if EXISTS tbl_tipos_mensajes CASCADE;

CREATE TABLE
    tbl_tipos_mensajes (
        id SERIAL PRIMARY KEY,
        tipo VARCHAR(50) NOT NULL,
        mensaje_template TEXT NOT NULL,
        estado BOOLEAN DEFAULT TRUE,
        fecha_borrado TIMESTAMP
    );

drop table if EXISTS tbl_mensajes CASCADE;

CREATE TABLE
    tbl_mensajes (
        id SERIAL PRIMARY KEY,
        tipo_mensaje_id INTEGER NOT NULL REFERENCES tbl_tipos_mensajes(id),
        usuario_id INTEGER NOT NULL REFERENCES tbl_usuarios(id),
        cita_id INTEGER REFERENCES tbl_citas(id),
        contenido TEXT NOT NULL,
        fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        estado BOOLEAN DEFAULT TRUE,
        fecha_borrado TIMESTAMP
    );

drop table if EXISTS tbl_rutas cascade;

CREATE TABLE IF NOT EXISTS tbl_rutas (
    id serial PRIMARY KEY,
    nombre_ruta VARCHAR(255) NOT NULL,
    activa BOOLEAN NOT NULL,
);


drop table if EXISTS tbl_permisos CASCADE;

CREATE TABLE tbl_permisos (
    id serial PRIMARY KEY,
    id_rol int, 
    id_ruta int, 
    activa boolean DEFAULT true,
    fecha_borrado TIMESTAMP,
    constraint fk_id_rol_1 FOREIGN KEY (id_rol) REFERENCES tbl_roles(id),
    constraint fk_id_ruta_1 FOREIGN KEY (id_ruta) REFERENCES tbl_rutas(id)
);



    

create table tbl_archivos
( 
    id serial PRIMARY key,
    nombre_archivo varchar(200), 
    mime_type varchar(200),
    archivo bytea
);

CREATE TABLE
    tbl_log_errores(
        id SERIAL NOT NULL,
        descripcion character varying(1000),
        proceso character varying(100),
        fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(id)
    );

CREATE TABLE
    tbl_log_de_acciones(
        id SERIAL NOT NULL,
        descripcion character varying(1000),
        fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(id)
    );    


