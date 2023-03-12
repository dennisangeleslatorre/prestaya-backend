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

        if(body) {
            const conn = await connect();
            const [responseProcedure, response] = await conn.query(`CALL sp_ListarDinamico_TransaccionesTienda(?,?,?,?,?,?,?,?,?,?,?,?)`,
            [ body.c_compania, body.c_agencia, body.d_fechadocumentoInicio, body.d_fechadocumentoFin,
                body.n_cliente, body.c_tipodocumento, body.c_numerodocumento, body.periodo_inicio,
                body.periodo_fin, body.c_item, body.c_prestamo, body.c_estado
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
        } return res.status(200).json({ message: "Se debe enviar algún dato para filtrar"  });

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
            const [responseProcedure, response] = await conn.query(`CALL prestaya.sp_Anular_Transacciones(?,?,?,?,?)`,
            [ body.c_compania, body.c_agencia, body.c_tipodocumento, body.c_numerodocumento, body.c_ultimousuario ]);
            await conn.end();
            const transaccionRes = responseProcedure as RowDataPacket;
            if(!transaccionRes[0][0]) {
                return res.status(200).json({message: "No se encontró nota de salida" });
            }
            return res.status(200).json({data:transaccionRes[0], message: "Se anuló correctamente" });
        } return res.status(200).json({ message: "Se debe enviar algún dato para filtrar"  });

    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}
