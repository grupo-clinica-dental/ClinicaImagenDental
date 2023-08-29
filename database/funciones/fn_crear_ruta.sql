CREATE OR REPLACE FUNCTION fn_crear_ruta(
    p_string_ruta character varying,
    p_activa boolean DEFAULT true
) 
RETURNS TABLE (
    exito boolean, 
    mensaje varchar(1000), 
    id_registro integer
)
AS $$
DECLARE
    v_exito boolean := true;
    v_mensaje varchar(1000);
BEGIN
    v_mensaje := 'Error en creación de ruta';

    INSERT INTO tbl_rutas (string_ruta, activa)
    VALUES (p_string_ruta, p_activa)
    RETURNING id INTO id_registro;

    v_mensaje := 'Error en la inserción del log';

    INSERT INTO tbl_log_de_acciones (descripcion)
    VALUES ('Se crea la ruta');

    v_mensaje := 'Operación Exitosa';
    RETURN QUERY SELECT v_exito, v_mensaje, id_registro;
EXCEPTION
    WHEN OTHERS THEN
        INSERT INTO tbl_log_errores (descripcion, proceso)
        VALUES (v_mensaje || ' - ' || SQLERRM, 'fn_crear_ruta');

        v_exito := false; 
        v_mensaje := 'Operación Errónea - ' || SQLERRM;

        RETURN QUERY SELECT v_exito, v_mensaje, id_registro;
END;
$$ LANGUAGE plpgsql;
