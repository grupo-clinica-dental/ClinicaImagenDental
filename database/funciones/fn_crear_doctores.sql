-- Active: 1691546713125@@127.0.0.1@5432@clinica_dental@public
CREATE OR REPLACE FUNCTION fn_crear_doctores(p_usuario_id int, p_fecha_borrado TIMESTAMP, p_color varchar) 
RETURNS TABLE (
    exito bool,
    mensaje varchar(1000),
    id_registro varchar(100)
) AS $$

DECLARE
    v_exito bool := true;
    v_mensaje varchar(1000);
    v_id varchar(100);

BEGIN
    v_mensaje := 'Error en creación de usuario ' || p_usuario_id;

    INSERT INTO tbl_doctores 
        (usuario_id, fecha_borrado, color)
    VALUES 
        (p_usuario_id, p_fecha_borrado, p_color)
    RETURNING id INTO v_id;

    v_mensaje := 'Error en la inserción del log';

    INSERT INTO tbl_log_de_acciones
        (descripcion)
    VALUES
        ('Se crea el usuario ' || p_usuario_id);

    v_mensaje := 'Operación Exitosa';

    RETURN QUERY SELECT v_exito, v_mensaje, v_id;

EXCEPTION
    WHEN OTHERS THEN
        INSERT INTO tbl_log_errores
            (descripcion, proceso)
        VALUES 
            (v_mensaje || ' - ' || SQLERRM, 'fn_crear_doctores');

        v_exito := false; 
        v_mensaje := 'Operación Errónea - ' || SQLERRM;

        RETURN QUERY SELECT v_exito, v_mensaje, p_usuario_id;
END;
$$ LANGUAGE plpgsql;
