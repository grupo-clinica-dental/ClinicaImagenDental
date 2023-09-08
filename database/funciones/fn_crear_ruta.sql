CREATE OR REPLACE FUNCTION fn_crear_ruta(
    p_nombre_ruta VARCHAR(300),
    p_activa BOOLEAN DEFAULT true
) 
RETURNS TABLE (
    exito BOOLEAN, 
    mensaje VARCHAR(1000), 
    id_registro INTEGER
)
AS $$
DECLARE
    v_exito BOOLEAN := true;
    v_mensaje VARCHAR(1000);
BEGIN
    v_mensaje := 'Error en creación de ruta';

    -- Inserta la nueva ruta en la tabla tbl_rutas
    INSERT INTO tbl_rutas (nombre_ruta, activa)
    VALUES (p_nombre_ruta, p_activa)
    RETURNING id INTO id_registro;

    -- Si la inserción fue exitosa, establece el mensaje de éxito
    v_mensaje := 'Operación Exitosa';
    RETURN QUERY SELECT v_exito, v_mensaje, id_registro;

EXCEPTION
    WHEN OTHERS THEN
        -- Si ocurre algún error, registra el error en tbl_log_errores y establece un mensaje de error
        INSERT INTO tbl_log_errores (descripcion, proceso)
        VALUES (v_mensaje || ' - ' || SQLERRM, 'fn_crear_ruta');

        v_exito := false; 
        v_mensaje := 'Operación Errónea - ' || SQLERRM;

        RETURN QUERY SELECT v_exito, v_mensaje, id_registro;
END;
$$ LANGUAGE plpgsql;
