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
    v_registro_existente int;
BEGIN
    -- Verificar si la especialidad existe
    SELECT COUNT(*) INTO v_registro_existente FROM tbl_especialidades WHERE id = p_id;
    
    IF v_registro_existente = 0 THEN
        v_mensaje := 'La especialidad con ID ' || p_id || ' no existe';
        v_exito := false;
        RETURN QUERY SELECT v_exito, v_mensaje, NULL;
    END IF;

    -- Intento de eliminar (desactivar) la especialidad
    UPDATE tbl_especialidades 
    SET activo = 'FALSE' 
    WHERE id = p_id;
    
    -- Registro de la acción en el log
    INSERT INTO tbl_log_de_acciones (descripcion)
    VALUES ('Se ha desactivado la especialidad con ID ' || p_id);

    v_mensaje := 'Operación exitosa: se ha desactivado la especialidad con ID ' || p_id;
    RETURN QUERY SELECT v_exito, v_mensaje, p_id::varchar;

EXCEPTION
    WHEN OTHERS THEN
        -- En caso de error, registro en el log de errores
        INSERT INTO tbl_log_errores (descripcion, proceso)
        VALUES ('Error al desactivar la especialidad: ' || SQLERRM, 'fn_eliminar_especialidades');
        
        v_exito := false;
        v_mensaje := 'Operación errónea: ' || SQLERRM;
        
        RETURN QUERY SELECT v_exito, v_mensaje, p_id::varchar;
END;
$$ LANGUAGE plpgsql;
