export interface Departamento {
    c_paiscodigo: string,
    c_departamentocodigo: string,
    c_descripcion: string,
    c_estado: string,
    c_usuarioregistro?: string,
    d_fecharegistro?: Date,
    c_ultimousuario?: string,
    d_ultimafechamodificacion?: Date
}