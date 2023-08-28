CREATE OR REPLACE FUNCTION fn_actualizar_doctores(p_usuario_id int, p_fecha_borrado TIMESTAMP, p_color varchar) 
RETURNS TABLE (
    exito bool,
    mensaje varchar(1000),
    id_registro varchar(100)
) AS $$
DECLARE
    v_exito bool := true;
    v_mensaje varchar(1000);
BEGIN
    v_mensaje := 'Error en actualización de doctor con usuario_id ' || p_fecha_borrado;

    UPDATE tbl_doctores SET fecha_borrado = p_fecha_borrado, color = p_color WHERE usuario_id = p_usuario_id;
    
    v_mensaje := 'Operación Exitosa';

    RETURN QUERY SELECT v_exito, v_mensaje, p_fecha_borrado;
EXCEPTION
    WHEN unique_violation THEN
        INSERT INTO tbl_log_errores (descripcion, proceso)
        VALUES (v_mensaje || ' - ' || SQLERRM, 'fn_actualizar_doctores');

        v_exito := false; 
        v_mensaje := 'Operación Errónea - ' || SQLERRM;

        RETURN QUERY SELECT v_exito, v_mensaje, p_fecha_borrado;
END;
$$ LANGUAGE plpgsql;


