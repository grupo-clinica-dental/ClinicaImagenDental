-- Active: 1691546713125@@127.0.0.1@5432@clinica_dental@public

CREATE OR REPLACE FUNCTION fn_crear_doctores(p_nombre VARCHAR, p_correo_electronico VARCHAR, p_color VARCHAR) 
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
    
    INSERT INTO tbl_doctores (nombre, correo_electronico, color)
    VALUES (p_nombre, p_correo_electronico, p_color)
    RETURNING id INTO v_id;
    
    
    INSERT INTO tbl_log_de_acciones (descripcion)
    VALUES ('Se crea el usuario ' || p_color);

    
    v_mensaje := 'Operación Exitosa';
    RETURN QUERY SELECT v_exito, v_mensaje, v_id;
EXCEPTION
    WHEN others THEN
        
        INSERT INTO tbl_log_errores (descripcion, proceso)
        VALUES (v_mensaje || ' - ' || SQLERRM, 'fn_crear_doctores');

        
        v_exito := false; 
        v_mensaje := 'Operación Errónea - ' || SQLERRM;

        RETURN QUERY SELECT v_exito, v_mensaje, p_color;
END;
$$ LANGUAGE plpgsql;

