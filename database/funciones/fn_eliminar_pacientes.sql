CREATE OR REPLACE FUNCTION fn_desactivar_paciente(p_id INT)
RETURNS TABLE
(
    exito BOOL,
    mensaje VARCHAR(1000),
    id_registro INT
)
AS $$
DECLARE
    v_exito BOOL := true;
    v_mensaje VARCHAR(1000);
    v_registro_existente int;
BEGIN
    -- Verificar si el paciente existe
    SELECT COUNT(*) INTO v_registro_existente FROM tbl_pacientes WHERE id = p_id;
    
    IF v_registro_existente = 0 THEN
        v_mensaje := 'El paciente con ID ' || p_id || ' no existe';
        v_exito := false;
        RETURN QUERY SELECT v_exito, v_mensaje, NULL;
    END IF;

    -- Intentar desactivar el paciente
    UPDATE tbl_pacientes 
    SET estado = false
    WHERE id = p_id;

    -- Registrar la acción
    INSERT INTO tbl_log_de_acciones(descripcion)
    VALUES ('Se desactivó el paciente con ID ' || p_id);

    -- Configurar mensaje de éxito
    v_mensaje := 'Operación Exitosa: Paciente desactivado con ID ' || p_id;
    RETURN QUERY SELECT v_exito, v_mensaje, p_id;

EXCEPTION WHEN OTHERS THEN
    -- En caso de error, registrar en tbl_log_errores
    INSERT INTO tbl_log_errores(descripcion, proceso)
    VALUES ('Error al desactivar el paciente: ' || SQLERRM, 'fn_desactivar_paciente');

    v_exito := false;
    v_mensaje := 'Operación Errónea: ' || SQLERRM;

    RETURN QUERY SELECT v_exito, v_mensaje, p_id;
END;
$$ LANGUAGE plpgsql;
