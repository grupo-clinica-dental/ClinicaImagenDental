CREATE OR REPLACE FUNCTION fn_eliminar_permiso(
    p_id_permiso integer
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
    v_mensaje := 'Error al eliminar permiso';

    DELETE FROM tbl_permisos
    WHERE id = p_id_permiso;

    v_mensaje := 'Operación Exitosa';
    RETURN QUERY SELECT v_exito, v_mensaje;
EXCEPTION
    WHEN OTHERS THEN
        INSERT INTO tbl_log_errores (descripcion, proceso)
        VALUES (v_mensaje || ' - ' || SQLERRM, 'fn_eliminar_permiso');

        v_exito := false; 
        v_mensaje := 'Operación Errónea - ' || SQLERRM;

        RETURN QUERY SELECT v_exito, v_mensaje;
END;
$$ LANGUAGE plpgsql;
