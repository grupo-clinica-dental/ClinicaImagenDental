CREATE OR REPLACE FUNCTION fn_crear_paciente(
    p_nombre VARCHAR, 
    p_telefono VARCHAR, 
    p_email VARCHAR, 
    p_fecha_nacimiento DATE
) RETURNS TABLE (
    exito BOOL,
    mensaje VARCHAR(1000),
    id_registro INT
)
AS $$
DECLARE
    v_exito BOOL := true;
    v_mensaje VARCHAR(1000);
    v_id_registro INT;  -- Declarada aquí para su uso en toda la función
BEGIN
    -- Intento de insertar un nuevo paciente
    INSERT INTO tbl_pacientes(nombre, telefono, email, fecha_nacimiento)
    VALUES (p_nombre, p_telefono, p_email, p_fecha_nacimiento)
    RETURNING id INTO v_id_registro;

    -- Log de la acción realizada
    INSERT INTO tbl_log_de_acciones(descripcion)
    VALUES ('Se ha creado el paciente con ID ' || v_id_registro);

    v_mensaje := 'Operación Exitosa';
    RETURN QUERY SELECT v_exito, v_mensaje, v_id_registro;

EXCEPTION
    WHEN OTHERS THEN
        -- En caso de error, se registra en tbl_log_errores
        INSERT INTO tbl_log_errores(descripcion, proceso)
        VALUES ('Error en fn_crear_paciente: ' || SQLERRM, 'fn_crear_paciente');

        v_exito := false;
        v_mensaje := 'Operación Errónea - ' || SQLERRM;
        RETURN QUERY SELECT v_exito, v_mensaje, NULL;  -- Devolvemos NULL como id_registro en caso de error
END;
$$ LANGUAGE plpgsql;
