export interface Cliente {
	c_compania:	string,
	n_cliente: string,
	c_apellidospaterno?:	string,
	c_apellidosmaterno?:	string,
	c_nombres?:	string,
	c_nombrescompleto?:	string,
	c_tipodocumento?:	string,
	c_numerodocumento?:	string,
	c_direccion?:	string,
	c_paiscodigo?:	string,
	c_departamentocodigo?:	string,
	c_provinciacodigo?:	string,
	c_distritocodigo?:	string,
	c_telefono1?:	string,
	c_telefono2?:	string,
	c_correo?:	string,
	d_fechaInicioOperaciones?: Date,
	c_estado?:	string,
	d_fechaInactivacion?:	Date,
	c_motivoinactivacion?:	string,
	c_usuarioregistro?:	string,
	d_fecharegistro?:	Date,
	c_ultimousuario?:	string,
	d_ultimafechamodificacion?:	Date
}


