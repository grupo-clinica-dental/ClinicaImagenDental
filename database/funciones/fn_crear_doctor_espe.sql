CREATE OR REPLACE FUNCTION public.fn_crear_doctor_especialidad(p_doctor_id integer, p_especialidad_id integer)
 RETURNS TABLE(exito boolean, mensaje character varying, doctor_id_registro integer, especialidad_id_registro integer)
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_exito BOOL := true;
    v_mensaje VARCHAR(1000);
BEGIN
    v_mensaje := 'Error en la creación del registro para doctor ID: ' || p_doctor_id || ' y especialidad ID: ' || p_especialidad_id;

    INSERT INTO tbl_doctor_especialidades(doctor_id, especialidad_id)
    VALUES (p_doctor_id, p_especialidad_id)
    RETURNING doctor_id, especialidad_id INTO doctor_id_registro, especialidad_id_registro;

    v_mensaje := 'Error en la inserción del log';

    INSERT INTO tbl_log_de_acciones(descripcion)
    VALUES ('Se crea el registro con doctor ID: ' || doctor_id_registro || ' y especialidad ID: ' || especialidad_id_registro);

    v_mensaje := 'Operación Exitosa';
    RETURN QUERY SELECT v_exito, v_mensaje, doctor_id_registro, especialidad_id_registro;

EXCEPTION WHEN OTHERS THEN
    INSERT INTO tbl_log_errores(descripcion, proceso)
    VALUES (v_mensaje || ' - ' || SQLERRM, 'fn_crear_doctor_especialidad');

    v_exito := false;
    v_mensaje := 'Operación Erronea - ' || SQLERRM;

    RETURN QUERY SELECT v_exito, v_mensaje, doctor_id_registro, especialidad_id_registro;
END;
$function$
