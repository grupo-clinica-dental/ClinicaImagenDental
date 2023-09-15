-- Active: 1691546713125@@127.0.0.1@5432@clinica_dental@public
CREATE OR REPLACE FUNCTION fn_actualizar_especialidades(
    p_nombre VARCHAR,
    p_id INT
)
RETURNS TABLE (
    exito BOOL,
    mensaje VARCHAR(1000),
    id_registro INT
)
AS $$
DECLARE
    v_exito BOOL := TRUE;
    v_mensaje VARCHAR(1000);

BEGIN
    v_mensaje := 'Error al actualizar la especialidad con ID ' || p_id;

    -- Actualizar la tabla de especialidades
    UPDATE tbl_especialidades 
    SET nombre = p_nombre
    WHERE id = p_id;

    -- Insertar un registro de log de acciones
    v_mensaje := 'Error en la inserción del log';
    INSERT INTO tbl_log_de_acciones (descripcion)
    VALUES ('Se actualizó la especialidad con ID ' || p_id);

    -- Establecer el mensaje de éxito
    v_mensaje := 'Operación Exitosa';

    RETURN QUERY SELECT v_exito, v_mensaje, p_id;

EXCEPTION WHEN OTHERS THEN
    -- Insertar un registro de log de errores
    INSERT INTO tbl_log_errores (descripcion, proceso)
    VALUES (v_mensaje || ' - ' || SQLERRM, 'fn_actualizar_especialidades');

    v_exito := FALSE;
    v_mensaje := 'Operación Errónea - ' || SQLERRM;
    RETURN QUERY SELECT v_exito, v_mensaje, p_id;

END;
$$ LANGUAGE plpgsql;
