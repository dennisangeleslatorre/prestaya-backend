export interface Role {
    n_perfil: number,
    c_codigoperfil: string,
    c_paginas: string,
    c_botones: string,
    c_usuarioregistro?: string,
    d_fecharegistro?: Date,
    c_ultimousuario?: string,
    d_ultimafechamodificacion?: Date,
    c_estado?: string
}