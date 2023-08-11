-- Active: 1691546713125@@127.0.0.1@5432@clinica_dental@public

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
        fecha_borra TIMESTAMP
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
        usuario_id INTEGER REFERENCES tbl_usuarios(id),
        estado BOOLEAN DEFAULT TRUE,
        fecha_borrado TIMESTAMP,
        color VARCHAR(7)
    );

drop table if EXISTS tbl_doctor_especialidades;

CREATE TABLE
    tbl_doctor_especialidades (
        doctor_id INTEGER NOT NULL,
        especialidad_id INTEGER NOT NULL,
        estado BOOLEAN DEFAULT TRUE,
        fecha_borrado TIMESTAMP,
        PRIMARY KEY (doctor_id, especialidad_id),
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

create table
    tbl_rutas (
        id serial PRIMARY key,
        string_ruta varchar(300),
        activa bool DEFAULT true,
        fecha_borrado TIMESTAMP
    );

drop table if EXISTS tbl_permisos CASCADE;

create table
    tbl_permisos (
        id serial PRIMARY key,
        id_ruta int,
        id_rol int,
        activa bool DEFAULT true,
        fecha_borrado TIMESTAMP,
        constraint fk_id_rol_permiso Foreign Key (id_rol) REFERENCES tbl_roles(id),
        constraint fk_id_ruta Foreign Key (id_ruta) REFERENCES tbl_rutas(id)
    );