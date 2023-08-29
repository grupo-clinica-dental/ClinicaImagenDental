CREATE OR REPLACE FUNCTION fn_actualizar_permiso(
    p_id integer,
    p_id_ruta integer,
    p_id_rol integer,
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
    v_mensaje := 'Error en actualizar permiso con ID ' || p_id;

    UPDATE tbl_permisos
    SET id_ruta = p_id_ruta,
        id_rol = p_id_rol,
        activa = p_activa
    WHERE id = p_id;

    v_mensaje := 'Error en la inserción del log';

    INSERT INTO tbl_log_de_acciones (descripcion)
    VALUES ('Se actualiza un permiso');

    v_mensaje := 'Operación Exitosa';
    RETURN QUERY SELECT v_exito, v_mensaje;

EXCEPTION
    WHEN OTHERS THEN
        v_exito := false;
        v_mensaje := 'Operación Errónea - ' || SQLERRM;

        INSERT INTO tbl_log_errores (descripcion, proceso)
        VALUES (v_mensaje || ' - ' || SQLERRM, 'fn_actualizar_permiso');

        RETURN QUERY SELECT v_exito, v_mensaje;
END;
$$ LANGUAGE plpgsql;
