CREATE OR REPLACE FUNCTION public.fn_desactivar_doctor_especialidad(p_doctor_id integer, p_especialidad_id integer)
 RETURNS TABLE(exito boolean, mensaje character varying)
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_exito BOOL := true;
    v_mensaje VARCHAR(1000);

BEGIN
    v_mensaje := 'Error al desactivar la especialidad con doctor ID ' || p_doctor_id || ' y especialidad ID ' || p_especialidad_id;

    UPDATE tbl_doctor_especialidades
    SET estado = false,
        fecha_borrado = NOW()
    WHERE doctor_id = p_doctor_id AND especialidad_id = p_especialidad_id;

    v_mensaje := 'Operación Exitosa';
    RETURN QUERY SELECT v_exito, v_mensaje;

EXCEPTION WHEN OTHERS THEN
    v_exito := false;
    v_mensaje := 'Operación Erronea - ' || SQLERRM;
    RETURN QUERY SELECT v_exito, v_mensaje;
END;
$function$
