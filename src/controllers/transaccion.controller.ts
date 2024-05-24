import { Request, Response } from 'express'
import { connect } from '../database'
import { RowDataPacket } from 'mysql2'

export async function getTransaccionDinamico(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        body.c_compania	= body.c_compania ? body.c_compania : null;
        body.c_agencia	= body.c_agencia ? body.c_agencia : null;
        body.d_fechadocumentoInicio	= body.d_fechadocumentoInicio ? body.d_fechadocumentoInicio : null;
        body.d_fechadocumentoFin	= body.d_fechadocumentoFin ? body.d_fechadocumentoFin : null;
        body.n_cliente	= body.n_cliente ? body.n_cliente : null;
        body.c_tipodocumento	= body.c_tipodocumento ? body.c_tipodocumento : null;
        body.c_numerodocumento	= body.c_numerodocumento ? body.c_numerodocumento : null;
        body.periodo_inicio	= body.periodo_inicio ? body.periodo_inicio : null;
        body.periodo_fin	= body.periodo_fin ? body.periodo_fin : null;
        body.c_item	= body.c_item ? body.c_item : null;
        body.c_prestamo	= body.c_prestamo ? body.c_prestamo : null;
        body.c_estado	= body.c_estado ? body.c_estado : null;

        if(body.c_codigousuario) {
            const conn = await connect();
            const [responseProcedure, response] = await conn.query(`CALL sp_ListarDinamico_TransaccionesTienda(?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [ body.c_compania, body.c_agencia, body.d_fechadocumentoInicio, body.d_fechadocumentoFin,
                body.n_cliente, body.c_tipodocumento, body.c_numerodocumento, body.periodo_inicio,
                body.periodo_fin, body.c_item, body.c_prestamo, body.c_estado, body.c_codigousuario
                ]);
            await conn.end();
            const transaccionRes = responseProcedure as RowDataPacket;
            if(!transaccionRes[0][0]) {
                return res.status(200).json({message: "No se encontró transacciones" });
            }
            return res.status(200).json({data:transaccionRes[0], message: "Se obtuvo transacciones" });
        } return res.status(200).json({ message: "Se debe enviar algún dato para filtrar"  });

    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}


export async function getTransaccionDetalle(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        body.c_compania	= body.c_compania ? body.c_compania : null;
        body.c_agencia	= body.c_agencia ? body.c_agencia : null;
        body.c_tipodocumento	= body.c_tipodocumento ? body.c_tipodocumento : null;
        body.c_numerodocumento	= body.c_numerodocumento ? body.c_numerodocumento : null;
        if(body) {
            const conn = await connect();
            const [responseProcedure, response] = await conn.query(`CALL prestaya.sp_Obtener_TransaccionesDetalle(?,?,?,?)`,
            [ body.c_compania, body.c_agencia, body.c_tipodocumento, body.c_numerodocumento ]);
            await conn.end();
            const transaccionRes = responseProcedure as RowDataPacket;
            if(!transaccionRes[0][0]) {
                return res.status(200).json({message: "No se encontró detalles de la transacción" });
            }
            return res.status(200).json({data:transaccionRes[0], message: "Se obtuvo detalles de la transacción" });
        } return res.status(200).json({ message: "Se debe enviar el código de la transacción"  });

    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function getTransaccionCabecera(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        body.c_compania	= body.c_compania ? body.c_compania : null;
        body.c_agencia	= body.c_agencia ? body.c_agencia : null;
        body.c_tipodocumento	= body.c_tipodocumento ? body.c_tipodocumento : null;
        body.c_numerodocumento	= body.c_numerodocumento ? body.c_numerodocumento : null;
        if(body.c_compania && body.c_agencia && body.c_tipodocumento && body.c_numerodocumento) {
            const conn = await connect();
            const [responseProcedure, response] = await conn.query(`CALL prestaya.sp_obtener_Transaccion(?,?,?,?)`,
            [ body.c_compania, body.c_agencia, body.c_tipodocumento, body.c_numerodocumento ]);
            await conn.end();
            const transaccionRes = responseProcedure as RowDataPacket;
            if(!transaccionRes[0][0]) {
                return res.status(200).json({message: "No se encontró la transacción" });
            }
            return res.status(200).json({data:transaccionRes[0][0], message: "Se obtuvo la transacción" });
        } return res.status(200).json({ message: "Se debe enviar el código de la transacción"});

    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function registerTransaccion(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        if( body.c_agencia && body.c_compania && body.c_usuarioregistro && body.productos && body.detalles ) {
                const conn = await connect();
                const [responseProcedure, response] = await conn.query(`CALL prestaya.sp_Registrar_Tansacciones(?,?,?,?,?,@respuesta)`,
                [ body.c_compania, body.c_agencia, body.c_usuarioregistro, JSON.stringify(body.productos), JSON.stringify(body.detalles)]);
                await conn.end();
                const messageProcedure = responseProcedure as RowDataPacket;
                if(messageProcedure[0][0] && messageProcedure[0][0].respuesta) {
                    return res.status(200).json({ message: messageProcedure[0][0].respuesta});
                } return res.status(200).json({ message: "Ocurrió un error en el procedimiento"});
        } return res.status(200).json({ message: "Faltan datos para realizar el registro"});
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}


export async function updateTransaccionAnular(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        body.c_compania	= body.c_compania ? body.c_compania : null;
        body.c_agencia	= body.c_agencia ? body.c_agencia : null;
        body.c_tipodocumento	= body.c_tipodocumento ? body.c_tipodocumento : null;
        body.c_numerodocumento	= body.c_numerodocumento ? body.c_numerodocumento : null;
        body.c_ultimousuario	= body.c_ultimousuario ? body.c_ultimousuario : null;
        if(body) {
            const conn = await connect();
            const [responseProcedure, response] = await conn.query(`CALL prestaya.sp_Anular_Transacciones(?,?,?,?,?,@respuesta)`,
            [ body.c_compania, body.c_agencia, body.c_tipodocumento, body.c_numerodocumento, body.c_ultimousuario ]);
            await conn.end();
            const transaccionRes = responseProcedure as RowDataPacket;
            if(!transaccionRes[0][0]) {
                return res.status(200).json({message: "No se encontró nota de salida" });
            }
            return res.status(200).json({data:transaccionRes[0][0], message: transaccionRes[0][0].respuesta });
        } return res.status(200).json({ message: "Se debe enviar algún dato para filtrar"  });

    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function getReporteTransaccion(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        body.c_compania	= body.c_compania ? body.c_compania : null;
        body.c_agencia	= body.c_agencia ? body.c_agencia : null;
        body.d_fechadocumentoInicio	= body.d_fechadocumentoInicio ? body.d_fechadocumentoInicio : null;
        body.d_fechadocumentoFin	= body.d_fechadocumentoFin ? body.d_fechadocumentoFin : null;
        body.n_cliente	= body.n_cliente ? body.n_cliente : null;
        body.c_tipodocumento	= body.c_tipodocumento ? body.c_tipodocumento : null;
        body.c_numerodocumento	= body.c_numerodocumento ? body.c_numerodocumento : null;
        body.periodo_inicio	= body.periodo_inicio ? body.periodo_inicio : null;
        body.periodo_fin	= body.periodo_fin ? body.periodo_fin : null;
        body.c_item	= body.c_item ? body.c_item : null;
        body.c_prestamo	= body.c_prestamo ? body.c_prestamo : null;
        body.c_estado	= body.c_estado ? body.c_estado : null;

        if(body.c_codigousuario) {
            const conn = await connect();
            const [responseProcedure, response] = await conn.query(`CALL sp_GetReporte_TransaccionesTienda(?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [ body.c_compania, body.c_agencia, body.d_fechadocumentoInicio, body.d_fechadocumentoFin,
                body.n_cliente, body.c_tipodocumento, body.c_numerodocumento, body.periodo_inicio,
                body.periodo_fin, body.c_item, body.c_prestamo, body.c_estado, body.c_codigousuario
                ]);
            await conn.end();
            const transaccionRes = responseProcedure as RowDataPacket;
            if(!transaccionRes[0][0]) {
                return res.status(200).json({message: "No se encontró transacciones" });
            }
            return res.status(200).json({data:transaccionRes[0], message: "Se obtuvo transacciones" });
        } return res.status(503).json({ message: "Se debe enviar el código de usuario." });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}


export async function postTransaccionProductoIngreso(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        body.d_fechadocumento	= body.d_fechadocumento ? body.d_fechadocumento : null;
        body.n_cliente	= body.n_cliente ? body.n_cliente : null;
        body.c_moneda	= body.c_moneda ? body.c_moneda : null;
        body.c_observaciones	= body.c_observaciones ? body.c_observaciones : null;
        body.n_montototal	= body.n_montototal ? body.n_montototal : null;
        body.c_usuariooperacion	= body.c_usuariooperacion ? body.c_usuariooperacion : null;
        body.c_agenciarelacionado	= body.c_agenciarelacionado ? body.c_agenciarelacionado : null;
        body.c_usuariofctienda	= body.c_usuariofctienda ? body.c_usuariofctienda : null;
        body.c_tipomovimientoctd	= body.c_tipomovimientoctd ? body.c_tipomovimientoctd : null;
        body.c_nombreproveedor	= body.c_nombreproveedor ? body.c_nombreproveedor : null;
        body.c_tipodocumentorel	= body.c_tipodocumentorel ? body.c_tipodocumentorel : null;
        body.c_numerodocumentorel	= body.c_numerodocumentorel ? body.c_numerodocumentorel : null;
        body.c_usuariofctiendarelacionado	= body.c_usuariofctiendarelacionado ? body.c_usuariofctiendarelacionado : null;

        if(body.c_agencia && body.c_compania && body.c_ultimousuario && body.detalles) {
            const conn = await connect();
            const [responseProcedure, response] = await conn.query(`CALL prestaya.sp_Insertar_TransaccionProductoIngreso(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,@respuesta)`,
            [ body.c_compania, body.c_agencia, body.d_fechadocumento, body.n_cliente, body.c_moneda, body.c_observaciones, 
                body.n_montototal, body.c_ultimousuario, body.c_usuariooperacion, body.c_agenciarelacionado, body.c_usuariofctienda, body.c_tipomovimientoctd, 
                body.c_nombreproveedor, body.c_tipodocumentorel, body.c_numerodocumentorel, body.c_usuariofctiendarelacionado, JSON.stringify(body.detalles) ]);
            await conn.end();
            const transaccionRes = responseProcedure as RowDataPacket;
            let message = 'OK';
            if(transaccionRes && transaccionRes[0].length > 0) {
                transaccionRes.forEach((element: any) => {
                    if (element[0] && element[0]?.respuesta.includes("ERROR")) message = element[0].respuesta;
                });
            }
            if(message === 'OK')
                return res.status(200).json({data:transaccionRes[0][0], message: 'OK' });
            return res.status(200).json({message: message});
        } return res.status(200).json({ message: "Se debe enviar los datos aobligatorios"  });

    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}


export async function postTransaccionProductoSalida(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        body.d_fechadocumento	= body.d_fechadocumento ? body.d_fechadocumento : null;
        body.n_cliente	= body.n_cliente ? body.n_cliente : null;
        body.c_moneda	= body.c_moneda ? body.c_moneda : null;
        body.c_observaciones	= body.c_observaciones ? body.c_observaciones : null;
        body.n_montototal	= body.n_montototal ? body.n_montototal : null;
        body.c_usuariooperacion	= body.c_usuariooperacion ? body.c_usuariooperacion : null;
        body.c_agenciarelacionado	= body.c_agenciarelacionado ? body.c_agenciarelacionado : null;
        body.c_usuariofctienda	= body.c_usuariofctienda ? body.c_usuariofctienda : null;
        body.c_tipomovimientoctd	= body.c_tipomovimientoctd ? body.c_tipomovimientoctd : null;
        body.c_nombreproveedor	= body.c_nombreproveedor ? body.c_nombreproveedor : null;
        body.c_tipodocumentorel	= body.c_tipodocumentorel ? body.c_tipodocumentorel : null;
        body.c_numerodocumentorel	= body.c_numerodocumentorel ? body.c_numerodocumentorel : null;
        body.c_usuariofctiendarelacionado	= body.c_usuariofctiendarelacionado ? body.c_usuariofctiendarelacionado : null;

        if(body.c_agencia && body.c_compania && body.c_ultimousuario && body.detalles) {
                const conn = await connect();
                const [responseProcedure, response] = await conn.query(`CALL prestaya.sp_Insertar_TransaccionProductoSalida(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,@respuesta)`,
                [ body.c_compania, body.c_agencia, body.d_fechadocumento, body.n_cliente, body.c_moneda, body.c_observaciones, 
                    body.n_montototal, body.c_ultimousuario, body.c_usuariooperacion, body.c_agenciarelacionado, body.c_usuariofctienda, body.c_tipomovimientoctd, 
                    body.c_nombreproveedor, body.c_tipodocumentorel, body.c_numerodocumentorel, body.c_usuariofctiendarelacionado, JSON.stringify(body.detalles) ]);
                await conn.end();
                const transaccionRes = responseProcedure as RowDataPacket;
                let message = 'OK';
                if(transaccionRes && transaccionRes[0].length > 0) {
                    transaccionRes.forEach((element: any) => {
                        if (element[0] && element[0]?.respuesta.includes("ERROR")) message = element[0].respuesta;
                    });
                }
                if(message === 'OK')
                    return res.status(200).json({data:transaccionRes[0][0], message: 'OK' });
                return res.status(200).json({message: message});
            } return res.status(200).json({ message: "Se debe enviar los datos aobligatorios"  });
    
        } catch (error) {
            console.error(error)
            return res.status(500).send(error)
        }
    }

export async function postConfirmarTransaccionProductoSalida(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        body.c_usuariooperacion	= body.c_usuariooperacion ? body.c_usuariooperacion : null;
        body.c_usuariofctienda	= body.c_usuariofctienda ? body.c_usuariofctienda : null;
        body.c_agenciarelacionado	= body.c_agenciarelacionado ? body.c_agenciarelacionado : null;
        body.in_usuarioconfirmado	= body.in_usuarioconfirmado ? body.in_usuarioconfirmado : null;
        body.d_fechadocumento	= body.d_fechadocumento ? body.d_fechadocumento : null;

        if(body.c_agencia && body.c_compania && body.c_ultimousuario && body.detalles && body.c_tipodocumento && body.c_numerodocumento) {
            const conn = await connect();
            const [responseProcedure, response] = await conn.query(`CALL prestaya.sp_Confirmar_TransaccionFlujoTiendaSalida(?,?,?,?,?,?,?,?,?,?,@respuesta)`,
            [ body.c_compania, body.c_agencia, body.c_tipodocumento, body.c_numerodocumento, body.c_usuariooperacion, body.c_usuariofctienda, 
                body.d_fechadocumento, body.in_usuarioconfirmado, body.c_ultimousuario, JSON.stringify(body.detalles) ]);
                await conn.end();
                const transaccionRes = responseProcedure as RowDataPacket;
                let message = 'OK';
                if(transaccionRes && transaccionRes[0].length > 0) {
                    transaccionRes.forEach((element: any) => {
                        if (element[0] && element[0]?.respuesta.includes("ERROR")) message = element[0].respuesta;
                    });
                }
                if(message === 'OK')
                    return res.status(200).json({data:transaccionRes[0][0], message: 'OK' });
                return res.status(200).json({message: message});
            } return res.status(200).json({ message: "Se debe enviar los datos aobligatorios"  });
    
        } catch (error) {
            console.error(error)
            return res.status(500).send(error)
        }
    }