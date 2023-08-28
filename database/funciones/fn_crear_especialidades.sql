CREATE OR REPLACE FUNCTION fn_crear_especialidades(p_nombre VARCHAR, p_fecha_borrado TIMESTAMP) 
RETURNS TABLE (
    exito BOOL,
    mensaje VARCHAR(1000),
    id_registro VARCHAR(100)
)
AS $$
DECLARE
    v_exito BOOL := true;
    v_mensaje VARCHAR(1000);
    v_id_registro VARCHAR(100);
BEGIN
    BEGIN
       
        INSERT INTO tbl_especialidades (nombre, fecha_borrado)
        VALUES (p_nombre, p_fecha_borrado)
        RETURNING id INTO v_id_registro;

        
        INSERT INTO tbl_log_de_acciones (descripcion)
        VALUES ('Se crea el usuario ' || p_nombre);

        
        v_mensaje := 'Operación Exitosa';
    EXCEPTION
        WHEN OTHERS THEN
            
            INSERT INTO tbl_log_errores (descripcion, proceso)
            VALUES (v_mensaje || ' - ' || SQLERRM, 'fn_crear_especialidades');

            
            v_exito := false;
            v_mensaje := 'Operación Erronea - ' || SQLERRM;
    END;

    RETURN QUERY SELECT v_exito, v_mensaje, v_id_registro;
END;
$$ LANGUAGE plpgsql;
