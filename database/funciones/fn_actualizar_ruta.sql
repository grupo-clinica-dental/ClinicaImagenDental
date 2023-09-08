CREATE OR REPLACE FUNCTION fn_actualizar_ruta(
    p_id_ruta integer,
    p_nombre_ruta character varying,
    p_activa boolean
) 
RETURNS TABLE (
    exito boolean, 
    mensaje varchar(1000)
)
AS $$
DECLARE
    v_exito boolean := true;
    v_mensaje varchar(1000);
BEGIN
    v_mensaje := 'Error en actualización de ruta';

    UPDATE tbl_rutas
    SET nombre_ruta = p_nombre_ruta, activa = p_activa
    WHERE id = p_id_ruta;

    v_mensaje := 'Operación Exitosa';
    RETURN QUERY SELECT v_exito, v_mensaje;
EXCEPTION
    WHEN OTHERS THEN
        INSERT INTO tbl_log_errores (descripcion, proceso)
        VALUES (v_mensaje || ' - ' || SQLERRM, 'fn_actualizar_ruta');

        v_exito := false; 
        v_mensaje := 'Operación Errónea - ' || SQLERRM;

        RETURN QUERY SELECT v_exito, v_mensaje;
END;
$$ LANGUAGE plpgsql;

