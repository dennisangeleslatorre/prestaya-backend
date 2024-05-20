import { Request, Response } from 'express'
import { connect } from '../database'
import { TipoMovimientoCajaTienda } from '../interfaces/tipoMovimientoCajaTienda.interface'
import { ResultSetHeader } from "../interfaces/result"
import moment from 'moment'

export async function getTipoMovimientoCajaTienda(req: Request, res: Response): Promise<Response> {
    try {
        const conn = await connect();
        const [rows, fields] = await conn.query('SELECT * FROM ma_tipomovimientocajatienda where c_estado="A"')
        await conn.end();
        const tipoMovimientoCajaTiendaRes =rows as [TipoMovimientoCajaTienda];
        if(!tipoMovimientoCajaTiendaRes[0]) {
            return res.status(200).json({ data:[], message: "No se encontró tipos de movimientos de caja tienda." });
        }
        return res.status(200).json({ data:rows, message: "Se obtuvo registros." });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function getTipoMovimientoCajaTiendaAdmin(req: Request, res: Response) {
    try {
        const conn = await connect();
        const [rows, fields] = await conn.query('SELECT * FROM ma_tipomovimientocajatienda');
        await conn.end();
        const tipoMovimientoCajaTiendaRes = rows as [TipoMovimientoCajaTienda];
        if(!tipoMovimientoCajaTiendaRes[0]) {
            return res.status(200).json({ success: false, data:[], message: "No se encontró tipos de movimientos de caja tienda." });
        }
        return res.status(200).json({ success: true, data:rows, message: "Se obtuvo tipos de movimientos de caja tienda." });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

/* ARREGLAR DE ACA */
export async function registerTipoMovimientoCajaTienda(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        if(body.c_usuarioregistro) {
            body.c_ultimousuario = body.c_usuarioregistro;
            body.d_fecharegistro = moment().format('YYYY-MM-DD HH:MM:ss');
            body.d_ultimafechamodificacion = moment().format('YYYY-MM-DD HH:MM:ss');
            if(body.c_tipomovimientoctd && body.c_descricpion && body.c_clasetipomov && body.c_flagtransacciontienda) {
                const tipoMovimientoCajaTienda: TipoMovimientoCajaTienda = body;
                const conn = await connect();
                const data = await conn.query('INSERT INTO ma_tipomovimientocajatienda SET ?', [tipoMovimientoCajaTienda]);
                await conn.end();
                const parsedRes: ResultSetHeader = data[0] as ResultSetHeader;
                return res.status(200).json({ success: true, data: tipoMovimientoCajaTienda, message: "Se registró el tipo de movimiento de caja tienda con éxito." });
            } return res.status(503).json({message: "Parámetros incompletos. Favor de completar los campos requeridos." });
        } return res.status(503).json({message: "No se está enviando el usuario que realiza el registro." });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error";
        if(errorAux.errno === 1062) message = "Existe un tipo de movimiento de caja con esos datos.";
        return res.status(500).send({error: error, message: message});
    }
}


export async function getTipoMovimientoCajaTiendaByCodigoTipoMovimientoCajaTienda(req: Request, res: Response): Promise<Response> {
    try {
        const c_tipomovimientoctd = req.params.c_tipomovimientoctd;
        if(c_tipomovimientoctd) {
            const conn = await connect();
            const [rows, fields] = await conn.query('SELECT * FROM ma_tipomovimientocajatienda where c_tipomovimientoctd=?',[c_tipomovimientoctd])
            await conn.end();
            const tipoMovimientoCajaTiendaRes =rows as [TipoMovimientoCajaTienda];
            if(!tipoMovimientoCajaTiendaRes[0]) {
                return res.status(200).json({ data:[], message: "No se encontró el tipo de movimiento de caja tienda." });
            }
            return res.status(200).json({ data:tipoMovimientoCajaTiendaRes[0], message: "Se obtuvo registros." });
        }
        return res.status(200).json({ message: "Se debe enviar el código para listar la información del tipo de movimiento de caja." });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function updateTipoMovimientoCajaTienda(req: Request, res: Response): Promise<Response> {
    try {
        //Obtener datos
        const c_tipomovimientoctd = req.params.c_tipomovimientoctd;
        const body = req.body;
        if(body.c_ultimousuario) {
            body.d_ultimafechamodificacion = moment().format('YYYY-MM-DD HH:MM:ss');
            const tipoMovimientoCajaTienda: TipoMovimientoCajaTienda = req.body;
            const conn = await connect();
            await conn.query('UPDATE ma_tipomovimientocajatienda SET ? WHERE c_tipomovimientoctd = ?', [tipoMovimientoCajaTienda, c_tipomovimientoctd]);
            await conn.end();
            return res.status(200).json({ data: {...tipoMovimientoCajaTienda}, message: "Se actualizó el tipo de movimiento de caja tienda con éxito"  });
        }
        return res.status(500).json({message: "No se está enviando el usuario que realiza la actualización." });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error.";
        if(errorAux.errno === 1062) message = "Existe un tipo de movimiento de caja con esos datos";
        return res.status(500).send({error: error, message: message});
    }
}

export async function deleteTipoMovimientoCajaTienda(req: Request, res: Response): Promise<Response> {
    try {
        const c_tipomovimientoctd = req.params.c_tipomovimientoctd;
        if(c_tipomovimientoctd) {
            const conn = await connect();
            await conn.query('DELETE FROM ma_tipomovimientocajatienda WHERE c_tipomovimientoctd = ?', [c_tipomovimientoctd]);
            await conn.end();
            return res.status(200).json({ message: "Se eliminó el tipo de movimiento de caja tienda con éxito"  });
        }return res.status(200).json({ message: "Se debe enviar el código del tipo de movimiento de caja tienda"  });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error.";
        if(errorAux.errno === 1217) message = "No se puede eliminar el tipo de movimiento de caja tienda debido a que tiene datos asociados";
        return res.status(500).send({error: error, message: message});
    }
}

export async function getTipoMovimientoCajaTiendaParaTransacciones(req: Request, res: Response): Promise<Response> {
    try {
        const c_clasetipomov = req.body.c_clasetipomov ? req.body.c_clasetipomov : true;
        const c_flagtransacciontienda = req.body.c_flagtransacciontienda ? req.body.c_flagtransacciontienda : true;
        const conn = await connect();
        const [rows, fields] = await conn.query('SELECT * FROM ma_tipomovimientocajatienda where c_estado="A" AND c_clasetipomov = ? AND c_flagtransacciontienda = ?',
        [c_clasetipomov, c_flagtransacciontienda]);
        await conn.end();
        const tipoMovimientoCajaTiendaRes =rows as [TipoMovimientoCajaTienda];
        if(!tipoMovimientoCajaTiendaRes[0]) {
            return res.status(200).json({ data:[], message: "No se encontró tipos de movimientos de caja tienda." });
        }
        return res.status(200).json({ data:rows, message: "Se obtuvo registros." });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}