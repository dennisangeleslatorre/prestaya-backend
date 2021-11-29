export interface User {
    c_codigousuario: string,
    c_nombres?: string,
    c_correo?: string,
    c_telefono?: string,
    n_perfil: number,
    c_estado: string,
    c_usuarioregistro?: string,
    d_fecharegistro?: Date,
    c_ultimousuario?: string,
    d_ultimafechamodificacion?: Date,
    c_clave?: string
}