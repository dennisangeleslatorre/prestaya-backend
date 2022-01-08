import { Request, Response } from 'express'
import { connect } from '../database'
import { TipoProducto } from 'interfaces/tipoProducto.interface'
import { ResultSetHeader } from "../interfaces/result"
import moment from 'moment'

export async function getTipoProducto(req: Request, res: Response): Promise<Response> {
    try {
        const conn = await connect();
        const [rows, fields] = await conn.query('SELECT c_tipoproducto, c_descripcion FROM ma_tipoproducto where c_estado="A"')
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
        const [rows, fields] = await conn.query('SELECT * FROM ma_tipoproducto')
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
        body.c_ultimousuario = body.c_usuarioregistro;
            body.d_fecharegistro = moment().format('YYYY-MM-DD HH:MM:ss');
            if(body.c_tipoproducto && body.c_descripcion ) {
                const tipoProducto: TipoProducto = body;
                const conn = await connect();
                const data = await conn.query('INSERT INTO ma_tipoproducto SET ?', [tipoProducto]);
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

export async function updateTipoProducto(req: Request, res: Response): Promise<Response> {
    try {
        //Obtener datos
        const c_tipoproducto = req.params.c_tipoproducto;
        const body = req.body;
        if (body.c_ultimousuario) {
            body.d_ultimafechamodificacion = moment().format('YYYY-MM-DD HH:MM:ss');
            const tipoProducto: TipoProducto = body;
            const conn = await connect();
            const resp = await conn.query('UPDATE ma_tipoproducto SET ? WHERE c_tipoproducto = ?', [tipoProducto, c_tipoproducto]);
            console.log("resp", resp)
            await conn.end();
            return res.status(200).json({ message: "Se actualizó el tipo de documento con éxito"  });
        }
        return res.status(500).json({ message: "No se está enviando el usuario que realiza la actualización."  });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error.";
        if(errorAux.errno === 1062) message = "Existe un tipo de documento con esos datos";
        return res.status(500).send({error: error, message: message});
    }
}

export async function getTipoProductoByCodigoTipoProducto(req: Request, res: Response): Promise<Response> {
    try {
        const c_tipoproducto = req.params.c_tipoproducto;
        const conn = await connect();
        const [rows, fields] = await conn.query('SELECT * FROM ma_tipoproducto WHERE c_tipoproducto = ?', [c_tipoproducto]);
        await conn.end();
        const tipoProductoRes = rows as [TipoProducto];
        if(!tipoProductoRes[0]) {
            return res.status(200).json({ success: false, data:{}, message: "No se encontró el tipo de producto." });
        }
        return res.status(200).json({ success: true, data: tipoProductoRes[0], message: "Se obtuvo el tipo de producto con éxito." });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}

export async function deleteTipoProducto(req: Request, res: Response): Promise<Response> {
    try {
        const c_tipoproducto = req.params.c_tipoproducto;
        const conn = await connect();
        await conn.query('DELETE FROM ma_tipoproducto WHERE c_tipoproducto = ?', [c_tipoproducto]);
        await conn.end();
        return res.status(200).json({ message: "Se eliminó el tipo de producto con éxito"  });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error.";
        if(errorAux.errno === 1217) message = "No se puede eliminar el tipo de producto debido a que tiene datos asociados";
        return res.status(500).send({error: error, message: message});
    }
}
