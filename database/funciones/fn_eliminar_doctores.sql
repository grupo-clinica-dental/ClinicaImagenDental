CREATE OR REPLACE FUNCTION fn_eliminar_doctores(p_id int)
RETURNS TABLE (
    exito boolean,
    mensaje varchar(1000),
    id_registro varchar(100)
)
AS $$
DECLARE
    v_exito boolean := true;
    v_mensaje varchar(1000);
    v_registro_existente int;
BEGIN
    -- Verificar si el doctor existe
    SELECT COUNT(*) INTO v_registro_existente FROM tbl_doctores WHERE id = p_id;
    
    IF v_registro_existente = 0 THEN
        v_mensaje := 'El doctor con ID ' || p_id || ' no existe';
        v_exito := false;
        RETURN QUERY SELECT v_exito, v_mensaje, NULL;
    END IF;

    -- Intento de eliminar (desactivar) al doctor
    UPDATE tbl_doctores 
    SET estado = 'false' 
    WHERE id = p_id;
    
    -- Log de la acción
    INSERT INTO tbl_log_de_acciones (descripcion)
    VALUES ('Se ha desactivado el doctor con ID ' || p_id);

    v_mensaje := 'Operación exitosa: se ha desactivado el doctor con ID ' || p_id;
    RETURN QUERY SELECT v_exito, v_mensaje, p_id::varchar;

EXCEPTION
    WHEN others THEN
        -- En caso de error, se registra en el log de errores
        INSERT INTO tbl_log_errores (descripcion, proceso)
        VALUES ('Error al desactivar al doctor: ' || SQLERRM, 'fn_eliminar_doctores');

        v_exito := false;
        v_mensaje := 'Operación errónea: ' || SQLERRM;
        RETURN QUERY SELECT v_exito, v_mensaje, p_id::varchar;
END;
$$ LANGUAGE plpgsql;
