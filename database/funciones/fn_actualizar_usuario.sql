CREATE OR REPLACE FUNCTION FN_ACTUALIZAR_USUARIO(
    P_ID INT, 
    P_NOMBRE VARCHAR, 
    P_EMAIL VARCHAR, 
    P_TELEFONO VARCHAR, 
    P_PASSWORD VARCHAR,
) RETURNS TABLE(
    EXITO BOOL, 
    MENSAJE VARCHAR(1000)
) AS $$ 
DECLARE 
    v_exito BOOL := true;
    v_mensaje VARCHAR(1000);
    v_cantidad_actualizados INT;
BEGIN 
    v_mensaje := 'Error al actualizar el usuario con ID ' || P_ID;
    
    UPDATE tbl_usuarios
    SET
        nombre = COALESCE(P_NOMBRE, nombre),
        email = COALESCE(P_EMAIL, email),
        telefono = COALESCE(P_TELEFONO, telefono),
        password = COALESCE(P_PASSWORD, password),
    WHERE
        id = P_ID
        AND estado = TRUE 
    RETURNING 1 INTO v_cantidad_actualizados;
    
    IF v_cantidad_actualizados = 0 THEN 
        v_exito := false;
        v_mensaje := 'Usuario no encontrado o no está activo';
        RETURN QUERY SELECT v_exito, v_mensaje;
        RETURN;
    END IF;
    
    v_mensaje := 'Usuario actualizado exitosamente';
    RETURN QUERY SELECT v_exito, v_mensaje;

EXCEPTION
    WHEN OTHERS THEN
        INSERT INTO tbl_log_errores (descripcion, proceso)
        VALUES (
            v_mensaje || ' - ' || SQLERRM,
            'FN_ACTUALIZAR_USUARIO'
        );
        
        v_exito := false;
        v_mensaje := 'Operación Errónea - ' || SQLERRM;
        RETURN QUERY SELECT v_exito, v_mensaje;
END;
$$ LANGUAGE plpgsql;
