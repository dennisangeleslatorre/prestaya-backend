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
        if(!tipoProductoRes[0]) {
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
        if(!TipoProductoRes[0]) {
            return res.status(200).json({data:[], message: "No se encontró tipos de producto" });
        }
        return res.status(200).json({data:rows, message: "Se obtuvo registros" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function registerTipoProducto(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
       if(body.c_usuarioregistro) {
            body.c_ultimousuario = body.c_usuarioregistro
            if(body.c_tipoproducto && body.c_descripcion ) {
                const tipoProducto: TipoProducto = body;
                const conn = await connect();
                const data = await conn.query('INSERT INTO MA_TIPOPRODUCTO SET ?', [tipoProducto]);
                await conn.end();
                const parsedRes: ResultSetHeader = data[0] as ResultSetHeader;
                return res.status(200).json({ data: tipoProducto, message: "Se registró el tipo de producto con éxito." });
            }return res.status(200).json({message: "Parámetros incompletos. Favor de completar los campos requeridos." });
       }return res.status(503).json({message: "No se está enviando el usuario que realiza el registro." });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error";
        if(errorAux.errno === 1062) message = "Existe un tipo de producto con esos datos";
        return res.status(500).send({error: error, message: message});
    }
}