CREATE OR REPLACE FUNCTION fn_actualizar_ruta(
    p_id integer,
    p_string_ruta character varying,
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
    v_mensaje := 'Error en actualizar ruta con ID ' || p_id;

    UPDATE tbl_rutas
    SET string_ruta = p_string_ruta,
        activa = p_activa
    WHERE id = p_id;

    v_mensaje := 'Error en la inserción del log';

    INSERT INTO tbl_log_de_acciones (descripcion)
    VALUES ('Se actualizó la ruta con ID ' || p_id);

    v_mensaje := 'Operación Exitosa';
    RETURN QUERY SELECT v_exito, v_mensaje;

EXCEPTION
    WHEN OTHERS THEN
        v_exito := false;
        v_mensaje := 'Operación Errónea - ' || SQLERRM;

        INSERT INTO tbl_log_errores (descripcion, proceso)
        VALUES (v_mensaje || ' - ' || SQLERRM, 'fn_actualizar_ruta');

        RETURN QUERY SELECT v_exito, v_mensaje;
END;
$$ LANGUAGE plpgsql;
