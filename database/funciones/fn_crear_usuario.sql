CREATE OR REPLACE FUNCTION public.fn_crear_usuario(p_nombre character varying, p_email character varying, p_telefono character varying, p_password character varying, p_rol_id integer)
 RETURNS TABLE(exito boolean, mensaje character varying, id_registro integer)
 LANGUAGE plpgsql
AS $function$ DECLARE v_exito BOOLEAN := TRUE;
	v_mensaje VARCHAR(1000);
	v_id int;
	BEGIN -- Tu lógica aquí
	INSERT INTO
	    tbl_usuarios (
	        nombre,
	        email,
	        telefono,
	        password,
            rol_id
	    )
	VALUES (
	        p_nombre,
	        p_email,
	        p_telefono,
	        p_password,
            p_rol_id
	    )
	RETURNING id INTO v_id;
	INSERT INTO
	    tbl_log_de_acciones (descripcion)
	VALUES (
	        'Usuario creado con ID ' || v_id
	    );
	v_mensaje := 'Usuario creado exitosamente con ID ' || v_id;
	RETURN QUERY SELECT v_exito, v_mensaje, v_id;
	EXCEPTION
	WHEN OTHERS THEN
	INSERT INTO
	    tbl_log_errores (descripcion, proceso)
	VALUES (
	        'Error al crear el usuario: ' || SQLERRM,
	        'fn_crear_usuario'
	    );
	v_exito := FALSE;
	v_mensaje := 'Error al crear el usuario: ' || SQLERRM;
	RETURN QUERY SELECT v_exito, v_mensaje, -1;
	END;
	$function$
