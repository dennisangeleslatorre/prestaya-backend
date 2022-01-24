export interface TipoProducto {
    c_tipoproducto:	string,
    c_descripcion:	string,
    c_estado?:	string,
    c_flagpeso?: string,
    c_usuarioregistro?:	string,
    d_fecharegistro?:	Date,
    c_ultimousuario?:	string,
    d_ultimafechamodificacion?:	Date
}