CREATE OR REPLACE FUNCTION FN_DESACTIVAR_USUARIO(P_ID INT) 
RETURNS TABLE(
    exito BOOL, 
    mensaje VARCHAR(1000)
) 
AS $$ 
DECLARE 
    v_exito BOOL := true;
    v_mensaje VARCHAR(1000);
    v_cantidad_actualizados INT;
BEGIN 
    -- Verificación inicial si el usuario con el ID proporcionado existe
    SELECT COUNT(*) INTO v_cantidad_actualizados FROM tbl_usuarios WHERE id = P_ID;

    IF v_cantidad_actualizados = 0 THEN
        v_exito := false;
        v_mensaje := 'Usuario con ID ' || P_ID || ' no encontrado';
        RETURN QUERY SELECT v_exito, v_mensaje;
        RETURN;
    END IF;

    -- Intenta marcar el usuario como inactivo
    UPDATE tbl_usuarios 
    SET 
        estado = false,
        fecha_borra = CURRENT_TIMESTAMP
    WHERE 
        id = P_ID
    RETURNING 1 INTO v_cantidad_actualizados;

    -- Comprobación después de la actualización
    IF v_cantidad_actualizados = 0 THEN
        v_exito := false;
        v_mensaje := 'Error al marcar el usuario con ID ' || P_ID || ' como inactivo';
    ELSE
        v_mensaje := 'Usuario marcado como inactivo exitosamente';
    END IF;

    RETURN QUERY SELECT v_exito, v_mensaje;

EXCEPTION
    WHEN OTHERS THEN
        -- Insertar en el log de errores en caso de fallo
        INSERT INTO tbl_log_errores (descripcion, proceso)
        VALUES (
            'Error al desactivar el usuario: ' || SQLERRM,
            'FN_DESACTIVAR_USUARIO'
        );

        v_exito := false;
        v_mensaje := 'Operación Errónea - ' || SQLERRM;
        
        RETURN QUERY SELECT v_exito, v_mensaje;
END;
$$ LANGUAGE plpgsql;
