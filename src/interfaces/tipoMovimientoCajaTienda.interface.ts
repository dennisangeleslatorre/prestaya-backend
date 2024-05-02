export interface TipoMovimientoCajaTienda {
    c_tipomovimientoctd: string,
    c_descricpion: string,
    c_clasetipomov: string,
    c_estado: string
    c_usuarioregistro?: string,
    d_fecharegistro?: Date,
    c_ultimousuario?: string,
    d_ultimafechamodificacion?: Date,
    c_tipomovimientoctdinverso?: string,
    c_flagtransacciontienda?: string,
}