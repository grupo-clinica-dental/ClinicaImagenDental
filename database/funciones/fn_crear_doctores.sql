CREATE OR REPLACE FUNCTION fn_crear_doctores(
    p_nombre VARCHAR,
    p_usuario_id INT,
    p_color VARCHAR
) RETURNS TABLE (
    exito bool,
    mensaje varchar(1000),
    id_registro INT
) AS $$
DECLARE
    v_exito bool := true;
    v_mensaje varchar(1000);
    v_id INT;
BEGIN
    -- Inserción en la tabla de doctores
    INSERT INTO tbl_doctores (nombre, usuario_id, color)
    VALUES (p_nombre, p_usuario_id, p_color)
    RETURNING id INTO v_id;
    
    -- Log de acción
    INSERT INTO tbl_log_de_acciones (descripcion)
    VALUES ('Se crea el doctor con el nombre ' || p_nombre || ' y color ' || p_color);

    -- Mensaje de éxito
    v_mensaje := 'Operación Exitosa';
    RETURN QUERY SELECT v_exito, v_mensaje, v_id;

EXCEPTION
    WHEN others THEN
        -- Log de errores
        INSERT INTO tbl_log_errores (descripcion, proceso)
        VALUES (v_mensaje || ' - ' || SQLERRM, 'fn_crear_doctores');
        
        v_exito := false;
        v_mensaje := 'Operación Errónea - ' || SQLERRM;

        RETURN QUERY SELECT v_exito, v_mensaje, NULL;
END;
$$ LANGUAGE plpgsql;
