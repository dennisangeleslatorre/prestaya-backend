export interface FlujoCTienda {
    c_compania: string,
    n_correlativo: number
    c_agencia: string,
    c_tipofctienda: string,
    c_usuariofctienda: string,
    d_fechaInicioMov: Date,
    d_fechaFinMov: Date,
    c_monedafctienda: string,
    c_estado: string,
    c_observaciones?: string,
    c_usuarioregistro?: string,
    d_fecharegistro?: Date,
    c_ultimousuario?: string,
    d_ultimafechamodificacion?: Date
}

export interface FlujoCTiendaDia {
    general: {
        c_compania?: string,
        n_correlativo?: number,
        d_fechamov: string,
        c_estado:string,
        c_observaciones:string,
        c_usuarioregistro:string,
        d_fecharegistro:Date,
        c_ultimousuario:string,
        d_ultimafechamodificacion:Date,
    },
    movimientos: Array<FlujoCajaUsuarioDiaMovimiento> | []
}

export interface FlujoCajaUsuarioDiaMovimiento {
    c_compania?: string,
    n_correlativo?: number,
    d_fechamov?: string,
    n_secuencia: number,
    c_tipomovimientoctd: string,
    c_usuariomovimiento: string,
    n_montoxdiamov: number,
    c_observaciones:string,
    c_usuarioregistro:string,
    d_fecharegistro:Date,
    c_ultimousuario:string,
    d_ultimafechamodificacion:Date,
    c_flagtransaccion: string,
    c_tipodocumento: string,
    c_numerodocumento: string
}
