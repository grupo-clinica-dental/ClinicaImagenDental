CREATE OR REPLACE FUNCTION fn_eliminar_especialidades(p_id int)
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
    v_mensaje := 'Error en actualizar de usuario ' || p_id;

    UPDATE tbl_especialidades SET activo = 'FALSE' WHERE id = p_id;

    v_mensaje := 'Error en la inserción del log';

    INSERT INTO tbl_log_de_acciones (descripcion)
    VALUES ('Se actualizó el usuario ' || p_id);

    v_mensaje := 'Operación Exitosa';
    RETURN QUERY SELECT v_exito, v_mensaje, p_id::varchar;

EXCEPTION
    WHEN OTHERS THEN
        INSERT INTO tbl_log_errores (descripcion, proceso)
        VALUES (v_mensaje || ' - ' || SQLERRM, 'fn_eliminar_especialidades');

        v_exito := false;
        v_mensaje := 'Operación Errónea - ' || SQLERRM;

        RETURN QUERY SELECT v_exito, v_mensaje, p_id::varchar;
END;
$$ LANGUAGE plpgsql;
