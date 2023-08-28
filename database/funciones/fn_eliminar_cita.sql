CREATE OR REPLACE FUNCTION fn_desactivar_cita(p_id INT)
RETURNS TABLE
(
    exito BOOL,
    mensaje VARCHAR(1000)
)
AS $$
DECLARE
    v_exito BOOL := true;
    v_mensaje VARCHAR(1000);
BEGIN
    v_mensaje := 'Error en la desactivación de la cita con ID ' || p_id;

    UPDATE tbl_citas 
    SET estado = false, fecha_borrado = CURRENT_TIMESTAMP
    WHERE id = p_id;

    IF NOT FOUND THEN
        v_exito := false;
        v_mensaje := 'Cita no encontrada';
    ELSE
        v_mensaje := 'Operación Exitosa';
    END IF;

    RETURN QUERY SELECT v_exito, v_mensaje;

EXCEPTION WHEN OTHERS THEN
    INSERT INTO tbl_log_errores(descripcion, proceso)
    VALUES (v_mensaje || ' - ' || SQLERRM, 'fn_desactivar_cita');

    v_exito := false;
    v_mensaje := 'Operación Erronea - ' || SQLERRM;

    RETURN QUERY SELECT v_exito, v_mensaje;
END;
$$ LANGUAGE plpgsql;
