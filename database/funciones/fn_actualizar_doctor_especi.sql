CREATE OR REPLACE FUNCTION public.fn_actualizar_doctor_especialidad(p_id integer, p_doctor_id integer, p_especialidad_id integer)
 RETURNS TABLE(exito boolean, mensaje character varying)
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_exito BOOL := true;
    v_mensaje VARCHAR(1000);

BEGIN
    v_mensaje := 'Error en la actualización del registro con ID ' || p_id;

    UPDATE tbl_doctor_especialidades 
    SET doctor_id = p_doctor_id, 
        especialidad_id = p_especialidad_id
    WHERE id = p_id;

    v_mensaje := 'Error en la inserción del log';

    INSERT INTO tbl_log_de_acciones(descripcion)
    VALUES ('Se actualizó el registro con ID ' || p_id);

    v_mensaje := 'Operación Exitosa';
    RETURN QUERY SELECT v_exito, v_mensaje;

EXCEPTION WHEN OTHERS THEN
    INSERT INTO tbl_log_errores(descripcion, proceso)
    VALUES (v_mensaje || ' - ' || SQLERRM, 'fn_actualizar_doctor_especialidad');

    v_exito := false;
    v_mensaje := 'Operación Erronea - ' || SQLERRM;

    RETURN QUERY SELECT v_exito, v_mensaje;
END;
$function$
