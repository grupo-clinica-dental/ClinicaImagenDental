CREATE OR REPLACE FUNCTION fn_desactivar_cita(p_id INT)
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
    v_registro_existente INT;
BEGIN
    -- Verificar si la cita existe
    SELECT COUNT(*) INTO v_registro_existente FROM tbl_citas WHERE id = p_id;

    IF v_registro_existente = 0 THEN
        v_mensaje := 'La cita con ID ' || p_id || ' no existe';
        v_exito := false;
        RETURN QUERY SELECT v_exito, v_mensaje, NULL;
    END IF;

    -- Intento de desactivar la cita
    UPDATE tbl_citas 
    SET estado = false
    WHERE id = p_id;

    -- Log de la acción realizada
    INSERT INTO tbl_log_de_acciones(descripcion)
    VALUES ('Se desactivó la cita con ID ' || p_id);

    v_mensaje := 'Operación exitosa: se desactivó la cita con ID ' || p_id;
    RETURN QUERY SELECT v_exito, v_mensaje, p_id;

EXCEPTION
    WHEN OTHERS THEN
        -- En caso de error, registramos el error
        INSERT INTO tbl_log_errores(descripcion, proceso)
        VALUES ('Error al desactivar la cita: ' || SQLERRM, 'fn_desactivar_cita');
        
        v_exito := false;
        v_mensaje := 'Operación errónea: ' || SQLERRM;
        RETURN QUERY SELECT v_exito, v_mensaje, p_id;
END;
$$ LANGUAGE plpgsql;
