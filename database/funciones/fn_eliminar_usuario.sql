CREATE OR REPLACE FUNCTION FN_DESACTIVAR_USUARIO(P_ID 
INT) RETURNS TABLE(EXITO BOOL, MENSAJE VARCHAR(1000
)) AS $$ 
	DECLARE v_exito bool := true;
	v_mensaje varchar(1000);
	v_cantidad_actualizados int;
	BEGIN v_mensaje := 'Error al marcar el usuario con ID ' || p_id || ' como inactivo';
	UPDATE tbl_usuarios
	SET
	    estado = false,
	    fecha_borra = CURRENT_TIMESTAMP
	WHERE
	    id = p_id RETURNING 1 INTO v_cantidad_actualizados;
	IF v_cantidad_actualizados = 0 THEN v_exito := false;
	v_mensaje := 'Usuario no encontrado';
	RETURN QUERY SELECT v_exito, v_mensaje;
	RETURN;
	END IF;
	v_mensaje := 'Usuario marcado como inactivo exitosamente';
	RETURN QUERY SELECT v_exito, v_mensaje;
	EXCEPTION
	WHEN OTHERS THEN
	INSERT INTO
	    tbl_log_errores (descripcion, proceso)
	VALUES (
	        v_mensaje || ' - ' || SQLERRM,
	        'fn_desactivar_usuario'
	    );
	v_exito := false;
	v_mensaje := 'Operación Errónea - ' || SQLERRM;
	RETURN QUERY SELECT v_exito, v_mensaje;
	END;
	$$ LANGUAGE plpgsql;
