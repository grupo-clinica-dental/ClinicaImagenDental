CREATE OR REPLACE FUNCTION fn_desactivar_paciente(p_id INT)
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
    v_mensaje := 'Error al desactivar el paciente con ID ' || p_id;

    UPDATE tbl_pacientes 
    SET estado = false
    WHERE id = p_id;

    v_mensaje := 'Error en la inserción del log';

    INSERT INTO tbl_log_de_acciones(descripcion)
    VALUES ('Se desactivó el paciente con ID ' || p_id);

    v_mensaje := 'Operación Exitosa';
    RETURN QUERY SELECT v_exito, v_mensaje, p_id;

EXCEPTION WHEN OTHERS THEN
    INSERT INTO tbl_log_errores(descripcion, proceso)
    VALUES (v_mensaje || ' - ' || SQLERRM, 'fn_desactivar_paciente');

    v_exito := false;
    v_mensaje := 'Operación Erronea - ' || SQLERRM;

    RETURN QUERY SELECT v_exito, v_mensaje, p_id;
END;
$$ LANGUAGE plpgsql;
