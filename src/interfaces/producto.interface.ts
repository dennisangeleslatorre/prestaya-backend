export interface Producto {
    c_compania:	string,
    c_agencia:	string,
    c_item:	string,
    c_descripcionproducto:	string,
    c_tipoproducto:	string,
    c_unidadmedida:	string,
    c_observaciones: string,
    n_pesobruto: number,
    n_pesoneto: number,
    c_prestamo: string,
    c_estado: string,
    c_usuarioregistro?: string,
    d_fecharegistro?:	Date,
    c_ultimousuario?: string,
    d_ultimafechamodificacion?:	Date
}

export interface Stock {
    c_compania:	string,
    c_agencia:	string,
    c_item:	string,
    n_cantidad: number,
    c_usuarioregistro?: string,
    d_fecharegistro?: Date,
    c_ultimousuario?: string,
    d_ultimafechamodificacion?:	Date
}