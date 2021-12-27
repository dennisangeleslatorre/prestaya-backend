import { Request, Response } from 'express'
import { connect } from '../database'


export async function registerPrestamo(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        if(body.c_usuarioregistro) {
            body.c_ultimousuario = body.c_usuarioregistro;
            body.c_usuarioregpendiente = body.c_usuarioregistro;
            if(body.c_compania && body.n_cliente && body.c_paiscodigo && body.c_departamentocodigo && body.c_provinciacodigo && body.c_distritocodigo) {
                const conn = await connect();
                const [[rows,fields], response] = await conn.query(`CALL sp_Registrar_Prestamo('?','?','?','?', '?', '?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?',@out_respuesta)`,[body.c_compania,body.n_cliente,body.c_nombrecompleto,body.c_tipodocumento,body.c_numerodocumento,body.c_direccioncliente,body.c_paiscodigo,body.c_despartamentocodigo,body.c_provinciacodigo,body.c_distritocodigo,body.c_telefono1,body.c_monedaprestamo,body.n_montoprestamo,body.n_tasainteres,body.n_montointereses,body.n_montototalprestamo,body.d_fechadesembolso,body.n_diasplazo,body.d_fechavencimiento,body.n_montointeresesdiario,body.c_observacionesregistro,body.c_usuarioregistro,body.c_ultimousuario,body.c_usuarioregpendiente]);
                await conn.end();
                if(!rows[0]) {
                    return res.status(200).json({data:[], message: "No se obtuvo respuesta" });
                }
                return res.status(200).json({data:rows, message: "Se registró correctamente" });
            }return res.status(200).json({ message: "Se debe enviar los datos obligatorios" });
        } return res.status(503).json({message: "No se está enviando el usuario que realiza el registro." });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}