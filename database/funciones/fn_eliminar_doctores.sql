CREATE OR REPLACE FUNCTION fn_eliminar_doctores(p_id int)
RETURNS TABLE (
    exito boolean,
    mensaje varchar(1000),
    id_registro varchar(100)
)
AS $$
DECLARE
    v_exito boolean := true;
    v_mensaje varchar(1000);
BEGIN
   
    UPDATE tbl_doctores SET estado = 'false' WHERE id = p_id;
    
    
    INSERT INTO tbl_log_de_acciones (descripcion)
    VALUES ('Se actualizó el usuario ' || p_id);

    
    v_mensaje := 'Operación Exitosa';
    RETURN QUERY SELECT v_exito, v_mensaje, p_id::varchar;
EXCEPTION
    
    WHEN others THEN
       
        INSERT INTO tbl_log_errores (descripcion, proceso)
        VALUES (v_mensaje || ' - ' || SQLERRM, 'fn_eliminar_doctores');
        
        
        v_exito := false;
        v_mensaje := 'Operación Erronea - ' || SQLERRM;

        
        RETURN QUERY SELECT v_exito, v_mensaje, p_id::varchar;
END;
$$ LANGUAGE plpgsql;

