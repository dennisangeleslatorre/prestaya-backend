import { Request, Response } from 'express'
import { connect } from '../database'
import { TipoProducto } from 'interfaces/tipoProducto.interface'
import { ResultSetHeader } from "../interfaces/result"
import moment from 'moment'

export async function getTipoProducto(req: Request, res: Response): Promise<Response> {
    try {
        const conn = await connect();
        const [rows, fields] = await conn.query('SELECT c_tipoproducto, c_descripcion FROM MA_TIPOPRODUCTO where c_estado="A"')
        await conn.end();
        const tipoProductoRes = rows as [TipoProducto];
        if(!tipoProductoRes) {
            return res.status(200).json({data:[], message: "No se encontró tipo de producto" });
        }
        return res.status(200).json({data:rows, message: "Se obtuvo registros" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function getTipoProductoAdmin(req: Request, res: Response): Promise<Response> {
    try {
        const conn = await connect();
        const [rows, fields] = await conn.query('SELECT * FROM MA_TIPOPRODUCTO')
        await conn.end();
        const TipoProductoRes = rows as [TipoProducto];
        if(!TipoProductoRes) {
            return res.status(200).json({data:[], message: "No se encontró tipos de documento" });
        }
        return res.status(200).json({data:rows, message: "Se obtuvo registros" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}
