CREATE TABLE
    IF NOT EXISTS tbl_roles (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL,
        estado BOOLEAN DEFAULT TRUE,
        fecha_borrado TIMESTAMP
    );


CREATE TABLE
    IF NOT EXISTS tbl_usuarios (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        telefono VARCHAR(15),
        password VARCHAR(255) NOT NULL,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        estado BOOLEAN DEFAULT TRUE,
        fecha_borrado TIMESTAMP,
        id_rol INT REFERENCES tbl_roles(id)
    );


CREATE TABLE
    IF NOT EXISTS tbl_colores (
        id SERIAL PRIMARY KEY,
        codigo VARCHAR(8) NOT NULL,
        nombre VARCHAR(60),
        estado BOOLEAN DEFAULT TRUE,
        fecha_borrado TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS tbl_doctores (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        usuario_id INT REFERENCES tbl_usuarios(id) NULL,
        estado BOOLEAN DEFAULT TRUE,
        fecha_borrado TIMESTAMP,
        color VARCHAR(7)
    );

-- Table clinica_dental_api_type.tbl_pacientes

CREATE TABLE
    IF NOT EXISTS tbl_pacientes (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        telefono VARCHAR(15) NOT NULL,
        email VARCHAR(100) NOT NULL,
        fecha_nacimiento DATE,
        estado BOOLEAN DEFAULT TRUE,
        fecha_borrado TIMESTAMP
    );

-- Table clinica_dental_api_type.tbl_estados_cita

CREATE TABLE
    IF NOT EXISTS tbl_estados_cita (
        id SERIAL PRIMARY KEY,
        estado BOOLEAN DEFAULT TRUE,
        nombre VARCHAR(255) NOT NULL,
        fecha_borrado TIMESTAMP
    );

-- Table clinica_dental_api_type.tbl_citas

CREATE TABLE
    IF NOT EXISTS tbl_citas (
        id SERIAL PRIMARY KEY,
        fecha_creacion TIMESTAMP NOT NULL,
        doctor_id INT REFERENCES tbl_doctores(id),
        paciente_id INT REFERENCES tbl_pacientes(id),
        estado_id INT REFERENCES tbl_estados_cita(id),
        google_calendar_event_id VARCHAR(255),
        ubicacion VARCHAR(255),
        notas TEXT,
        estado BOOLEAN DEFAULT TRUE,
        fecha_borrado TIMESTAMP,
        fecha_inicio TIMESTAMP NOT NULL,
        fecha_final TIMESTAMP NOT NULL
    );

-- Table clinica_dental_api_type.tbl_especialidades

CREATE TABLE
    IF NOT EXISTS tbl_especialidades (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL,
        estado BOOLEAN DEFAULT TRUE,
        fecha_borrado TIMESTAMP
    );

-- Table clinica_dental_api_type.tbl_doctor_especialidades

CREATE TABLE
    IF NOT EXISTS tbl_doctor_especialidades (
        doctor_id INT REFERENCES tbl_doctores(id),
        especialidad_id INT REFERENCES tbl_especialidades(id),
        estado BOOLEAN DEFAULT TRUE,
        fecha_borrado TIMESTAMP,
        PRIMARY KEY (doctor_id, especialidad_id)
    );

-- Table clinica_dental_api_type.tbl_tipos_mensajes

CREATE TABLE
    IF NOT EXISTS tbl_tipos_mensajes (
        id SERIAL PRIMARY KEY,
        tipo VARCHAR(50) NOT NULL,
        estado BOOLEAN DEFAULT TRUE,
        fecha_borrado TIMESTAMP
    );

-- Table clinica_dental_api_type.tbl_mensajes

CREATE TABLE
    IF NOT EXISTS tbl_mensajes (
        id SERIAL PRIMARY KEY,
        tipo_mensaje_id INT REFERENCES tbl_tipos_mensajes(id),
        contenido TEXT NOT NULL,
        estado BOOLEAN DEFAULT TRUE,
        fecha_borrado TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS tbl_estados_mensajes (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(60) NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS tbl_citas_mensajes (
        id SERIAL PRIMARY KEY,
        cita_id INT REFERENCES tbl_citas(id),
        tipo_mensaje_id INT REFERENCES tbl_tipos_mensajes(id),
        fecha_programada TIMESTAMP,
        estado BOOLEAN DEFAULT TRUE,
        id_estado_mensaje INT REFERENCES tbl_estados_mensajes(id),
        fecha_borrado TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS tbl_mensajes_templates (
        id SERIAL PRIMARY KEY,
        tipo_mensaje_id INT REFERENCES tbl_tipos_mensajes(id),
        contenido TEXT NOT NULL,
        estado BOOLEAN DEFAULT TRUE,
        fecha_borrado TIMESTAMP
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