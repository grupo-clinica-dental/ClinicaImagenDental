-- Active: 1691546713125@@127.0.0.1@5432@clinica_dental@public
CREATE or replace FUNCTION fn_actualizar_especialidades( p_nombre varchar, p_id int) 
RETURNS  table 
                (   
                    exito bool, 
                    mensaje varchar(1000), 
                    id_registo varchar(100)
                )
   AS $$


DECLARE

    v_exito bool := true;
    v_mensaje varchar(1000);

BEGIN

    v_mensaje := 'Error en actualizar de usuario '||p_nombre;

    update tbl_especialidades 
    set nombre = p_nombre
    where id = p_id;


    v_mensaje := 'Error en la insercion del log';

    insert into tbl_log_de_acciones
    (descripcion)
    values
    ('Se actualizar el usuario '||p_nombre );


    v_mensaje := 'Operación Exitosa';
    return query select v_exito, p_nombre, v_mensaje;


EXCEPTION when OTHERS then 

    insert into tbl_log_errores
    ( descripcion, proceso)
    values 
    (v_mensaje ||' - '|| SQLERRM , 'fn_actualizar_especialidades');

    v_exito := false; 
    v_mensaje := 'Operación Erronea - '||SQLERRM;

    return query select v_exito,  v_mensaje, p_nombre;

    
END;
$$ LANGUAGE plpgsql;