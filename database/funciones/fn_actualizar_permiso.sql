CREATE OR REPLACE FUNCTION fn_actualizar_permiso(
    p_id_permiso integer,
    p_nombre_rol varchar(255),
    p_nombre_ruta varchar(300),
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

    UPDATE tbl_permisos
    SET nombre_rol = p_nombre_rol, nombre_ruta = p_nombre_ruta, activa = p_activa
    WHERE id = p_id_permiso;

    v_mensaje := 'Operación Exitosa';
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
