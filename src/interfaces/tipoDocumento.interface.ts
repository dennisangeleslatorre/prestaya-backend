export interface TipoDocumento {
    c_tipodocumento: string,
    c_descripcion: string,
    n_numerodigitos: number,
    c_estado: string,
    c_usuarioregistro?: string,
    d_fecharegistro?: Date,
    c_ultimousuario?: string,
    d_ultimafechamodificacion?: Date
}