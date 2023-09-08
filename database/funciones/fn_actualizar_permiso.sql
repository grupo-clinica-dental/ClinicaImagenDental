CREATE OR REPLACE FUNCTION fn_actualizar_permiso(
    p_id_permiso integer,
    p_rol_id integer,
    p_ruta_id integer,
    p_activa boolean DEFAULT true
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
    v_mensaje := 'Error en actualización de permiso';

    UPDATE tbl_permisos AS p
    SET rol_id = p_rol_id, ruta_id = p_ruta_id, activa = p_activa
    WHERE p.id = p_id_permiso;

    IF NOT FOUND THEN
        v_exito := false;
        v_mensaje := 'No se encontró el permiso con ID ' || p_id_permiso;
    ELSE
        v_mensaje := 'Operación Exitosa';
    END IF;

    RETURN QUERY SELECT v_exito, v_mensaje;
EXCEPTION
    WHEN OTHERS THEN
        INSERT INTO tbl_log_errores (descripcion, proceso)
        VALUES (v_mensaje || ' - ' || SQLERRM, 'fn_actualizar_permiso');

        v_exito := false; 
        v_mensaje := 'Operación Errónea - ' || SQLERRM;

        RETURN QUERY SELECT v_exito, v_mensaje;
END;
$$ LANGUAGE plpgsql;