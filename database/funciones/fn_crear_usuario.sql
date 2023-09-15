CREATE OR REPLACE FUNCTION FN_CREAR_USUARIO(
    P_NOMBRE VARCHAR(100), 
    P_EMAIL VARCHAR(100), 
    P_TELEFONO VARCHAR(15), 
    P_PASSWORD VARCHAR(255)
) RETURNS TABLE (
    EXITO BOOLEAN, 
    MENSAJE VARCHAR(1000), 
    ID_REGISTRO INT
) AS $$
DECLARE
    v_exito BOOLEAN := TRUE;
    v_mensaje VARCHAR(1000);
    v_id INT; -- Declarada aquí para su uso en toda la función
BEGIN
    -- Intento de insertar un nuevo usuario
    INSERT INTO tbl_usuarios (
        nombre, 
        email, 
        telefono, 
        password
    )
    VALUES (
        P_NOMBRE, 
        P_EMAIL, 
        P_TELEFONO, 
        P_PASSWORD
    )
    RETURNING id INTO v_id;
    
    -- Log de la acción realizada
    INSERT INTO tbl_log_de_acciones(descripcion)
    VALUES ('Usuario creado con ID ' || v_id);
    
    v_mensaje := 'Usuario creado exitosamente con ID ' || v_id;
    RETURN QUERY SELECT v_exito, v_mensaje, v_id;
    
EXCEPTION
    WHEN OTHERS THEN
        -- En caso de error, se registra en tbl_log_errores
        INSERT INTO tbl_log_errores(
            descripcion, 
            proceso
        )
        VALUES (
            'Error al crear el usuario en fn_crear_usuario: ' || SQLERRM, 
            'fn_crear_usuario'
        );

        v_exito := FALSE;
        v_mensaje := 'Error al crear el usuario: ' || SQLERRM;
        RETURN QUERY SELECT v_exito, v_mensaje, NULL; -- Devolvemos NULL como id_registro en caso de error
END;
$$ LANGUAGE plpgsql;
