-- Crear permiso
CREATE OR REPLACE FUNCTION fn_crear_permiso(
    p_rol_id integer,
    p_ruta_id integer,
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
    v_mensaje := 'Error en creación de permiso';

    INSERT INTO tbl_permisos (rol_id, ruta_id, activa)
    VALUES (p_rol_id, p_ruta_id, p_activa)
    RETURNING id INTO id_registro;

    v_mensaje := 'Operación Exitosa';
    RETURN QUERY SELECT v_exito, v_mensaje, id_registro;
EXCEPTION
    WHEN OTHERS THEN
        INSERT INTO tbl_log_errores (descripcion, proceso)
        VALUES (v_mensaje || ' - ' || SQLERRM, 'fn_crear_permiso');

        v_exito := false; 
        v_mensaje := 'Operación Errónea - ' || SQLERRM;

        RETURN QUERY SELECT v_exito, v_mensaje, id_registro;
END;
$$ LANGUAGE plpgsql;