CREATE OR REPLACE FUNCTION fn_eliminar_ruta(p_id int)
RETURNS TABLE (
    exito bool,
    mensaje varchar(1000),
    id_registro varchar(100)
)
AS $$
DECLARE
    v_exito bool := true;
    v_mensaje varchar(1000);

BEGIN
    v_mensaje := 'Error al eliminar ruta con ID ' || p_id;

    UPDATE tbl_rutas SET activa = false WHERE id = p_id;

    v_mensaje := 'Error en la inserción del log';

    INSERT INTO tbl_log_de_acciones (descripcion)
    VALUES ('Se eliminó la ruta con ID ' || p_id);

    v_mensaje := 'Operación Exitosa';
    RETURN QUERY SELECT v_exito, v_mensaje, p_id::varchar;

EXCEPTION
    WHEN OTHERS THEN
        v_mensaje := 'Operación Errónea - ' || SQLERRM;

        INSERT INTO tbl_log_errores (descripcion, proceso)
        VALUES (v_mensaje || ' - ' || SQLERRM, 'fn_eliminar_ruta');

        v_exito := false;
        RETURN QUERY SELECT v_exito, v_mensaje, p_id::varchar;
END;
$$ LANGUAGE plpgsql;
