export interface PrestamoProducto {
    c_compania:string,
    c_prestamo:string,
    n_linea:string,
    c_tipoproducto?:string,
    c_descripcionproducto?:string,
    c_unidadmedida?:string,
    n_cantidad?:number,
    n_pesobruto?:number,
    n_pesoneto?:number,
    c_observaciones?:string,
    n_montovalortotal?:number,
    c_usuarioregistro?:string,
    d_fecharegistro?:Date,
    c_ultimousuario?:string,
    d_ultimafechamodificacion?:Date
}