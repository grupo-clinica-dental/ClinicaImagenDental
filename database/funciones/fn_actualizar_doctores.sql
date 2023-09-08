CREATE OR REPLACE FUNCTION fn_actualizar_doctores(
    p_nombre varchar,
    p_correo_electronico varchar,
    p_color varchar,
    p_id int
)
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
    v_mensaje := 'Error en actualizar el usuario ' || p_nombre;

   
    UPDATE tbl_doctores
    SET nombre = p_nombre,
        correo_electronico = p_correo_electronico,
        color = p_color
    WHERE id = p_id;

    v_mensaje := 'Error en la inserción del log';

    
    INSERT INTO tbl_log_de_acciones (descripcion)
    VALUES ('Se actualizó el usuario ' || p_nombre);

    v_mensaje := 'Operación Exitosa';

    
    RETURN QUERY SELECT v_exito, v_mensaje, p_nombre;

EXCEPTION
WHEN OTHERS THEN
    
    INSERT INTO tbl_log_errores (descripcion, proceso)
    VALUES (v_mensaje || ' - ' || SQLERRM, 'fn_actualizar_doctores');

    v_exito := false;
    v_mensaje := 'Operación Errónea - ' || SQLERRM;

    
    RETURN QUERY SELECT v_exito, v_mensaje, p_nombre;
END;
$$ LANGUAGE plpgsql;

