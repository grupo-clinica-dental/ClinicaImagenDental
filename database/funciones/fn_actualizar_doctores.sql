CREATE OR REPLACE FUNCTION fn_actualizar_doctores(
    p_nombre VARCHAR,
    p_color VARCHAR,
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
    v_mensaje := 'Error al actualizar el doctor ' || p_nombre;

    -- Actualizar doctor
    UPDATE tbl_doctores
    SET nombre = p_nombre,
        color = p_color
    WHERE id = p_id;

    v_mensaje := 'Error en la inserción del log';

    INSERT INTO tbl_log_de_acciones (descripcion)
    VALUES ('Se actualizó el doctor ' || p_nombre);

    v_mensaje := 'Operación Exitosa';

    RETURN QUERY SELECT v_exito, v_mensaje, p_id;

EXCEPTION
WHEN OTHERS THEN
    -- Insertar log de errores
    INSERT INTO tbl_log_errores (descripcion, proceso)
    VALUES (v_mensaje || ' - ' || SQLERRM, 'fn_actualizar_doctores');

    v_exito := FALSE;
    v_mensaje := 'Operación Errónea - ' || SQLERRM;

    -- Devolver resultado
    RETURN QUERY SELECT v_exito, v_mensaje, p_id;
END;
$$ LANGUAGE plpgsql;
