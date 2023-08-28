CREATE OR REPLACE FUNCTION fn_crear_cita(p_fecha_hora TIMESTAMP, p_doctor_id INT, p_paciente_id INT, p_estado_id INT, p_google_calendar_event_id VARCHAR, p_ubicacion VARCHAR, p_descripcion VARCHAR, p_notas VARCHAR)
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
    v_mensaje := 'Error en la creación de la cita para ' || p_paciente_id;

    INSERT INTO tbl_citas(fecha_hora, doctor_id, paciente_id, estado_id, google_calendar_event_id, ubicacion, descripcion, notas)
    VALUES (p_fecha_hora, p_doctor_id, p_paciente_id, p_estado_id, p_google_calendar_event_id, p_ubicacion, p_descripcion, p_notas)
    RETURNING id INTO id_registro;

    v_mensaje := 'Error en la inserción del log';

    INSERT INTO tbl_log_de_acciones(descripcion)
    VALUES ('Se crea la cita para paciente ' || p_paciente_id);

    v_mensaje := 'Operación Exitosa';
    RETURN QUERY SELECT v_exito, v_mensaje, id_registro;

EXCEPTION WHEN OTHERS THEN
    INSERT INTO tbl_log_errores(descripcion, proceso)
    VALUES (v_mensaje || ' - ' || SQLERRM, 'fn_crear_cita');

    v_exito := false;
    v_mensaje := 'Operación Erronea - ' || SQLERRM;

    RETURN QUERY SELECT v_exito, v_mensaje, id_registro;
END;
$$ LANGUAGE plpgsql;
