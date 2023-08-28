CREATE OR REPLACE FUNCTION fn_crear_paciente(p_nombre VARCHAR, p_telefono VARCHAR, p_email VARCHAR, p_fecha_nacimiento DATE)
RETURNS TABLE
(
    exito BOOL,
    mensaje VARCHAR(1000),
    id_registro INT
)
AS $$
DECLARE
    v_exito BOOL := true;
    v_mensaje VARCHAR(1000);
BEGIN
    v_mensaje := 'Error en la creación del paciente ' || p_nombre;

    INSERT INTO tbl_pacientes(nombre, telefono, email, fecha_nacimiento)
    VALUES (p_nombre, p_telefono, p_email, p_fecha_nacimiento)
    RETURNING id INTO id_registro;

     v_mensaje := 'Error en la inserción del log';

    INSERT INTO tbl_log_de_acciones(descripcion)
    VALUES ('Se crea el paciente con ID ' || id_registro);

    v_mensaje := 'Operación Exitosa';
    RETURN QUERY SELECT v_exito, v_mensaje, id_registro;

EXCEPTION WHEN OTHERS THEN
    INSERT INTO tbl_log_errores(descripcion, proceso)
    VALUES (v_mensaje || ' - ' || SQLERRM, 'fn_crear_paciente');

    v_exito := false;
    v_mensaje := 'Operación Erronea - ' || SQLERRM;

    RETURN QUERY SELECT v_exito, v_mensaje, id_registro;
END;
$$ LANGUAGE plpgsql;

