CREATE OR REPLACE FUNCTION public.fn_archivos_post(p_nombre character varying, p_mime_type character varying, p_archivo bytea)
 RETURNS TABLE(id integer, nombre character varying, mime_type character varying)
 LANGUAGE plpgsql
AS $function$
 
declare 
    v_id_registro int;

BEGIN

    insert into tbl_archivos 
    (nombre_archivo, mime_type, archivo)
    values
    (p_nombre, p_mime_type, p_archivo ) returning tbl_archivos.id into v_id_registro;


    return query select a.id, 
                        a.nombre_archivo, 
                        a.mime_type 
                from    tbl_archivos a 
                where   a.id = v_id_registro;
    
END;
$function$