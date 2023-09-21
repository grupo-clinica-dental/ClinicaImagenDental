DROP FUNCTION fn_crear_cita;
CREATE OR REPLACE FUNCTION public.fn_crear_cita(p_fecha_hora timestamp without time zone, p_doctor_id integer, p_paciente_id integer, p_estado_id integer, p_descripcion character varying, p_notas character varying, p_google_calendar_event_id character varying DEFAULT NULL::character varying, p_ubicacion character varying DEFAULT NULL::character varying)
 RETURNS TABLE(exito boolean, mensaje character varying, id_registro integer)
 LANGUAGE plpgsql
AS $function$
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
$function$

