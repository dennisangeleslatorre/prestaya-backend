export interface TipoMovimientoCaja {
    c_tipomovimientocc: string,
    c_descripcion: string,
    c_clasetipomov: string,
    c_flagusuario: string,
    c_estado: string,
    c_usuarioregistro?: string,
    d_fecharegistro?: Date,
    c_ultimousuario?: string,
    d_ultimafechamodificacion?: Date,
}