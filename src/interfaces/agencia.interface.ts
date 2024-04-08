export interface Agencia {
    c_compania:	string,
    c_agencia:	string,
    c_descripcion:	string,
    c_estado?:	string,
    c_usuarioregistro?:	string,
    d_fecharegistro?:	Date,
    c_ultimousuario?:	string,
    d_ultimafechamodificacion?:	Date,
    c_flagvalidacju?: string
}


export interface RequestAgenciaByRole{
    flagencia:	string,
    lstagencia:	string
}