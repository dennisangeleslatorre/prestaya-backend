import { Request, Response } from 'express'
import { connect } from '../database'
import { RowDataPacket } from 'mysql2'

export async function getProductoDinamico(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        body.c_compania	= body.c_compania ? body.c_compania : null;
        body.c_agencia = body.c_agencia ? body.c_agencia : null;
        body.c_item = body.c_item ? body.c_item : null;
        body.c_estado = body.c_estado ? body.c_estado : null;
        body.c_tipoproducto = body.c_tipoproducto ? body.c_tipoproducto : null;
        body.c_descripcionproducto = body.c_descripcionproducto ? body.c_descripcionproducto : null;

        if(body.c_codigousuario) {
            const conn = await connect();
            const [responseProcedure, response] = await conn.query(`CALL sp_ListarDinamico_Producto(?,?,?,?,?,?,?)`,
            [ body.c_compania,body.c_agencia, body.c_estado, body.c_item, body.c_tipoproducto,
            body.c_descripcionproducto, body.c_codigousuario ]);
            await conn.end();
            const productoRes = responseProcedure as RowDataPacket;
            if(!productoRes[0][0]) {
                return res.status(200).json({message: "No se encontró productos" });
            }
            return res.status(200).json({data:productoRes[0], message: "Se obtuvo productos" });
        }return res.status(200).json({ message: "Se debe enviar algún dato para filtrar"  });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function getProductoStockDinamico(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        body.c_compania	= body.c_compania ? body.c_compania : null;
        body.c_agencia = body.c_agencia ? body.c_agencia : null;
        body.c_item = body.c_item ? body.c_item : null;
        if(body.c_compania || body.c_agencia || body.c_item) {
            const conn = await connect();
            const [responseProcedure, response] = await conn.query(`CALL sp_ListarDinamico_StockXProducto(?,?,?)`,
            [body.c_compania,body.c_agencia,body.c_item]);
            await conn.end();
            const productoRes = responseProcedure as RowDataPacket;
            if(!productoRes[0][0]) {
                return res.status(200).json({message: "No se encontró stock" });
            }
            return res.status(200).json({data:productoRes[0], message: "Se obtuvo stocks" });
        }return res.status(200).json({ message: "Se debe enviar algún dato para filtrar"  });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function actualizarDatosUbicacionSubtipo(req: Request, res: Response) {
    try {
        const body = req.body;
        body.c_compania	= body.c_compania ? body.c_compania : null;
        body.c_agencia = body.c_agencia ? body.c_agencia : null;
        body.c_item = body.c_item ? body.c_item : null;
        body.c_subtipoproducto = body.c_subtipoproducto ? body.c_subtipoproducto : null;
        body.c_ubicacion = body.c_ubicacion ? body.c_ubicacion : null;
        if ( body.c_compania && body.c_agencia && body.c_item ) {
            const conn = await connect();
            await conn.query('UPDATE ma_producto SET c_subtipoproducto = ?, c_ubicacion = ? WHERE c_compania = ? AND c_agencia = ? AND c_item = ?',
            [body.c_subtipoproducto, body.c_ubicacion, body.c_compania, body.c_agencia, body.c_item]);
            await conn.end();
            return res.status(200).json({ message: "Se actualizó la agencia con éxito"  });
        }
        return res.status(200).json({ message: "Se debe enviar algún dato para filtrar"  });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function getProductoDinamicoConPrecio(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        body.c_compania	= body.c_compania ? body.c_compania : null;
        body.c_agencia = body.c_agencia ? body.c_agencia : null;
        body.c_item = body.c_item ? body.c_item : null;
        body.c_estado = body.c_estado ? body.c_estado : null;
        body.c_tipoproducto = body.c_tipoproducto ? body.c_tipoproducto : null;
        body.c_descripcionproducto = body.c_descripcionproducto ? body.c_descripcionproducto : null;

        if(body.c_codigousuario) {
            const conn = await connect();
            const [responseProcedure, response] = await conn.query(`CALL sp_Listar_Productos_Stock_Precio(?,?,?,?,?,?,?)`,
            [ body.c_compania,body.c_agencia, body.c_estado, body.c_item, body.c_tipoproducto,
            body.c_descripcionproducto, body.c_codigousuario ]);
            await conn.end();
            const productoRes = responseProcedure as RowDataPacket;
            if(!productoRes[0][0]) {
                return res.status(200).json({message: "No se encontró productos" });
            }
            return res.status(200).json({data:productoRes[0], message: "Se obtuvo productos" });
        }return res.status(200).json({ message: "Se debe enviar algún dato para filtrar"  });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}