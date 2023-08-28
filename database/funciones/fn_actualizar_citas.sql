CREATE OR REPLACE FUNCTION fn_actualizar_cita(p_id INT, p_fecha_hora TIMESTAMP, p_doctor_id INT, p_paciente_id INT, p_estado_id INT, p_google_calendar_event_id VARCHAR, p_ubicacion VARCHAR, p_descripcion VARCHAR, p_notas TEXT)
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

BEGIN
    v_mensaje := 'Error en la actualización de la cita con ID ' || p_id;

    UPDATE tbl_citas 
    SET fecha_hora = p_fecha_hora, 
        doctor_id = p_doctor_id, 
        paciente_id = p_paciente_id, 
        estado_id = p_estado_id, 
        google_calendar_event_id = p_google_calendar_event_id,
        ubicacion = p_ubicacion,
        descripcion = p_descripcion,
        notas = p_notas
    WHERE id = p_id;

    v_mensaje := 'Error en la inserción del log';

    INSERT INTO tbl_log_de_acciones(descripcion)
    VALUES ('Se actualizó la cita con ID ' || p_id);

    v_mensaje := 'Operación Exitosa';
    RETURN QUERY SELECT v_exito, v_mensaje, p_id;

EXCEPTION WHEN OTHERS THEN
    INSERT INTO tbl_log_errores(descripcion, proceso)
    VALUES (v_mensaje || ' - ' || SQLERRM, 'fn_actualizar_cita');

    v_exito := false;
    v_mensaje := 'Operación Erronea - ' || SQLERRM;

    RETURN QUERY SELECT v_exito, v_mensaje, p_id;
END;
$$ LANGUAGE plpgsql;

