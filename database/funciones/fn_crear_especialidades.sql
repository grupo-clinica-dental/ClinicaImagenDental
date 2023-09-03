CREATE OR REPLACE FUNCTION fn_crear_especialidades(p_nombre VARCHAR, p_fecha_borrado TIMESTAMP) 
RETURNS TABLE (
    exito BOOL,
    mensaje VARCHAR(1000),
    id_registro VARCHAR(100)
)
AS $$
DECLARE
    v_exito BOOL := true;
    v_mensaje VARCHAR(1000) := 'Operación Exitosa';
    v_id_registro VARCHAR(100);
BEGIN
    BEGIN
        -- Intenta insertar un registro en tbl_especialidades
        INSERT INTO tbl_especialidades (nombre, fecha_borrado)
        VALUES (p_nombre, p_fecha_borrado)
        RETURNING id INTO v_id_registro;

        -- Registra la acción en tbl_log_de_acciones
        INSERT INTO tbl_log_de_acciones (descripcion)
        VALUES ('Se crea el usuario ' || p_nombre);

    EXCEPTION
        WHEN OTHERS THEN
            -- Si hay un error, registra el error en tbl_log_errores
            v_exito := false;
            v_mensaje := 'Operación Errónea - ' || SQLERRM;
            INSERT INTO tbl_log_errores (descripcion, proceso)
            VALUES (v_mensaje, 'fn_crear_especialidades');
    END;

    -- Devuelve los resultados
    RETURN QUERY SELECT v_exito, v_mensaje, v_id_registro;
END;
$$ LANGUAGE plpgsql;

