import { Request, Response } from 'express'
import { connect } from '../database'
import { TipoMovimientoCaja } from '../interfaces/tipoMovimientoCaja.interface'
import { ResultSetHeader, Result } from "../interfaces/result"
import moment from 'moment'

export async function getTipoMovimientoCaja(req: Request, res: Response): Promise<Response> {
    try {
        const conn = await connect();
        const [rows, fields] = await conn.query('SELECT * FROM ma_tipomovimientocaja where c_estado="A"')
        await conn.end();
        const tipoMovimientoCajaRes =rows as [TipoMovimientoCaja];
        if(!tipoMovimientoCajaRes[0]) {
            return res.status(200).json({ data:[], message: "No se encontró tipos de movimientos de caja." });
        }
        return res.status(200).json({ data:rows, message: "Se obtuvo registros." });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function getTipoMovimientoCajaAdmin(req: Request, res: Response) {
    try {
        const conn = await connect();
        const [rows, fields] = await conn.query('SELECT * FROM ma_tipomovimientocaja');
        await conn.end();
        const tipoMovimientoCajaRes = rows as [TipoMovimientoCaja];
        if(!tipoMovimientoCajaRes[0]) {
            return res.status(200).json({ success: false, data:[], message: "No se encontró tipos de movimientos de caja." });
        }
        return res.status(200).json({ success: true, data:rows, message: "Se obtuvo tipos de movimientos de caja." });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

/* ARREGLAR DE ACA */
export async function registerTipoMovimientoCaja(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        if(body.c_usuarioregistro) {
            body.c_ultimousuario = body.c_usuarioregistro;
            console.log(body.c_tipomovimientocc);
            console.log(body.c_descricpion);
            console.log(body.c_clasetipomov);
            console.log(body.c_flagusuario);
            if(body.c_tipomovimientocc && body.c_descricpion && body.c_clasetipomov && body.c_flagusuario) {
                const tipoMovimientoCaja: TipoMovimientoCaja = body;
                const conn = await connect();
                const data = await conn.query('INSERT INTO ma_tipomovimientocaja SET ?', [tipoMovimientoCaja]);
                await conn.end();
                const parsedRes: ResultSetHeader = data[0] as ResultSetHeader;
                return res.status(200).json({ success: true, data: tipoMovimientoCaja, message: "Se registró el tipo de movimiento de caja con éxito." });
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


export async function getTipoMovimientoCajaByCodigoTipoMovimientoCaja(req: Request, res: Response): Promise<Response> {
    try {
        const c_tipomovimientocc = req.params.c_tipomovimientocc;
        if(c_tipomovimientocc) {
            const conn = await connect();
            const [rows, fields] = await conn.query('SELECT * FROM ma_tipomovimientocaja where c_tipomovimientocc=?',[c_tipomovimientocc])
            await conn.end();
            const tipoMovimientoCajaRes =rows as [TipoMovimientoCaja];
            if(!tipoMovimientoCajaRes[0]) {
                return res.status(200).json({ data:[], message: "No se encontró el tipo de movimiento de caja." });
            }
            return res.status(200).json({ data:tipoMovimientoCajaRes[0], message: "Se obtuvo registros." });
        }
        return res.status(200).json({ message: "Se debe enviar el código para listar la información del tipo de movimiento de caja." });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function updateTipoMovimientoCaja(req: Request, res: Response): Promise<Response> {
    try {
        //Obtener datos
        const c_tipomovimientocc = req.params.c_tipomovimientocc;
        const body = req.body;
        if(body.c_ultimousuario) {
            body.d_ultimafechamodificacion = moment().format('YYYY-MM-DD HH:MM:ss');
            const tipoMovimientoCaja: TipoMovimientoCaja = req.body;
            const conn = await connect();
            await conn.query('UPDATE ma_tipomovimientocaja SET ? WHERE c_tipomovimientocc = ?', [tipoMovimientoCaja, c_tipomovimientocc]);
            await conn.end();
            return res.status(200).json({ data: {...tipoMovimientoCaja}, message: "Se actualizó el tipo de movimiento de caja con éxito"  });
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

export async function deleteTipoMovimientoCaja(req: Request, res: Response): Promise<Response> {
    try {
        const c_tipomovimientocc = req.params.c_tipomovimientocc;
        if(c_tipomovimientocc) {
            const conn = await connect();
            await conn.query('DELETE FROM ma_tipomovimientocaja WHERE c_tipomovimientocc = ?', [c_tipomovimientocc]);
            await conn.end();
            return res.status(200).json({ message: "Se eliminó el tipo de movimiento de caja con éxito"  });
        }return res.status(200).json({ message: "Se debe enviar el código del tipo de movimiento de caja"  });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error.";
        if(errorAux.errno === 1217) message = "No se puede eliminar el tipo de movimiento de caja debido a que tiene datos asociados";
        return res.status(500).send({error: error, message: message});
    }
}
