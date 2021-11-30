export interface Compania {
    c_compania: string,
    c_descricpion: string,
    c_ruc: string,
    c_direccion: string,
    c_paiscodigo: string,
    c_despartamentocodigo: string,
    c_provinciacodigo: string,
    c_distritocodigo: string,
    c_estado: string,
    c_usuarioregistro?: string,
    d_fecharegistro?: Date,
    c_ultimousuario?: string,
    d_ultimafechamodificacion?: Date
}