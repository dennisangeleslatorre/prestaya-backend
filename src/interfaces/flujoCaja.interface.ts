export interface FlujoCajaUsuario {
    c_compania: string,
    n_correlativo: number,
    c_agencia: string,
    c_tipofcu: string,
    c_usuariofcu: string,
    d_fechaInicioMov:Date,
    d_fechaFinMov:Date,
    c_monedafcu:string,
    c_estado:string,
    c_observaciones?:string,
    c_usuarioregistro?:string,
    d_fecharegistro?:Date,
    c_ultimousuario?:string,
    d_ultimafechamodificacion?:Date,
    detalles?: Array<FlujoCajaUsuarioDia>
}

export interface FlujoCajaUsuarioDia {
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
    c_tipomovimientocc: string,
    c_usuariomovimiento: string,
    n_montoxdiamov: number,
    c_observaciones:string,
    c_usuarioregistro:string,
    d_fecharegistro:Date,
    c_ultimousuario:string,
    d_ultimafechamodificacion:Date,
    c_prestamo?: string,
    n_linea?: string
}

export interface FlujoCajaUsuarioDiaMovimientoProcedure {
    c_compania: string,
    n_correlativo: number,
    c_agencia: string,
    c_tipofcu: string,
    c_usuariofcu: string,
    d_fechaInicioMov:Date,
    d_fechaFinMov:Date,
    c_monedafcu:string,
    c_estado:string,
    c_observaciones:string,
    c_usuarioregistro:string,
    d_fecharegistro:Date,
    c_ultimousuario:string,
    d_ultimafechamodificacion:Date,
    d_fechamov: string,
    estadodetalle: string,
    observacionesdetalle: string,
    usuarioregistrodetalle: string,
    fecharegistrodetalle: Date,
    usuariomodificaciondetalle: string,
    fechamodificaciondetalle: Date,
    n_secuencia: number,
    c_tipomovimientocc: string,
    c_usuariomovimiento: string,
    observacionesmovimiento: string,
    n_montoxdiamov: number,
    usuarioregistromovimiento: string,
    fecharegistromovimiento: Date,
    usuariomodificacionmovimiento: string,
    fechamodificacionmovimiento: Date,
    c_prestamo?: string,
    n_linea?: string
}