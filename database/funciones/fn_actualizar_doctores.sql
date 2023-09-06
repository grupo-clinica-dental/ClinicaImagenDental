CREATE OR REPLACE FUNCTION fn_actualizar_doctores(p_nombre VARCHAR, p_correo_electronico VARCHAR, p_color VARCHAR, p_id INT) 
RETURNS TABLE (
    exito boolean, 
    mensaje varchar(1000), 
    id_registro varchar(100)
)
AS $$
DECLARE
    v_exito boolean := true;
    v_mensaje varchar(1000) := 'Operación Exitosa';
BEGIN
    -- Actualizar el registro del doctor
    UPDATE tbl_doctores 
    SET nombre = p_nombre, correo_electronico = p_correo_electronico, color = p_color 
    WHERE id = p_id;

    -- Registrar la acción
    INSERT INTO tbl_log_de_acciones (descripcion)
    VALUES ('Se actualizó el usuario ' || p_nombre);

    RETURN QUERY SELECT v_exito, v_mensaje, p_id :: VARCHAR;

EXCEPTION 
    WHEN OTHERS THEN
        -- Registrar el error específico
        INSERT INTO tbl_log_errores (descripcion, proceso)
        VALUES (v_mensaje || ' - ' || SQLERRM, 'fn_actualizar_doctores');
        
        v_exito := false; 
        v_mensaje := 'Operación Errónea - ' || SQLERRM;

        RETURN QUERY SELECT v_exito, v_mensaje, p_id :: VARCHAR;
END;
$$ LANGUAGE plpgsql;
