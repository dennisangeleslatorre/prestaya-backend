export interface SubtipoProducto {
  c_tipoproducto: string,
  c_subtipoproducto: string,
  c_descripcion: string,
  c_estado: string,
  n_porcremate: number,
  n_porcvtatienda: number,
  c_usuarioregistro?: string,
  d_fecharegistro?: Date,
  c_ultimousuario?: string,
  d_ultimafechamodificacion?: Date,
}