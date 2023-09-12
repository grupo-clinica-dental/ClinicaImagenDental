CREATE OR REPLACE FUNCTION FN_CREAR_USUARIO(P_NOMBRE 
VARCHAR(100), P_EMAIL VARCHAR(100), P_TELEFONO VARCHAR
(15), P_PASSWORD VARCHAR(255)) RETURNS TABLE(EXITO 
BOOLEAN, MENSAJE VARCHAR(1000), ID_REGISTRO INT) AS 
	$$ DECLARE v_exito BOOLEAN := TRUE;
	v_mensaje VARCHAR(1000);
	v_id int;
	BEGIN -- Tu lógica aquí
	INSERT INTO
	    tbl_usuarios (
	        nombre,
	        email,
	        telefono,
	        password
	    )
	VALUES (
	        p_nombre,
	        p_email,
	        p_telefono,
	        p_password
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
	RETURN QUERY SELECT v_exito, v_mensaje, NULL;
	END;
	$$ LANGUAGE plpgsql;
