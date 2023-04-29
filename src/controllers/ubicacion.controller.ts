import { Request, Response } from 'express'
import { connect } from '../database'
import { UbicacionAgencia } from '../interfaces/ubicacionAgencia.interface'
import { ResultSetHeader, Result } from "../interfaces/result"
import moment from 'moment'

export async function registerUbicacionAgencia(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        if(body.c_usuarioregistro) {
            body.c_ultimousuario = body.c_usuarioregistro;
            if(body.c_compania && body.c_agencia && body.c_ubicacion && body.c_descripcion) {
                const ubicacionagencia: UbicacionAgencia = body;
                const conn = await connect();
                const data = await conn.query('INSERT INTO prestaya.ma_ubicacionagencia SET ?', [ubicacionagencia]);
                await conn.end();
                const parsedRes: ResultSetHeader = data[0] as ResultSetHeader;
                return res.status(200).json({ success: true, data: ubicacionagencia, message: "Se registró la ubicación de la agencia con éxito." });
            } return res.status(503).json({message: "Parámetros incompletos. Favor de completar los campos requeridos." });
        } return res.status(503).json({message: "No se está enviando el usuario que realiza el registro." });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error";
        if(errorAux.errno === 1062) message = "Existe un registro con esos datos.";
        return res.status(500).send({error: error, message: message});
    }
}

export async function getAgenciaUbicacion(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        const ubicacionagencia: UbicacionAgencia = body;
        if(ubicacionagencia.c_compania && ubicacionagencia.c_agencia ) {
            const conn = await connect();
            const [rows, fields] = await conn.query('SELECT * FROM prestaya.ma_ubicacionagencia where c_estado="A" AND c_compania=? AND c_agencia=?',[ubicacionagencia.c_compania,ubicacionagencia.c_agencia])
            await conn.end();
            const ubicacionagenciaRes =rows as [UbicacionAgencia];
            if(!ubicacionagenciaRes[0]) {
                return res.status(200).json({ data:[], message: "No se encontró ubiación para esa agencia" });
            }
            return res.status(200).json({ data:rows, message: "Se obtuvo registros" });
        }return res.status(200).json({ message: "Se debe enviar la compañía y agencia para listar la ubicación" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function getAllAgenciaUbicacion(req: Request, res: Response): Promise<Response> {
    try {
            const conn = await connect();
            const [rows, fields] = await conn.query(
                `SELECT mc.c_descripcion as compania_desc, ma.c_descripcion as agencia_desc, mu.*
                FROM prestaya.ma_ubicacionagencia mu
                INNER JOIN ma_agencia ma ON mu.c_compania=ma.c_compania AND mu.c_agencia=ma.c_agencia
                INNER JOIN ma_compania mc ON ma.c_compania=mc.c_compania`)
            await conn.end();
            const ubicacionagenciaRes =rows as [UbicacionAgencia];
            if(!ubicacionagenciaRes[0]) {
                return res.status(200).json({ data:[], message: "No se encontró ubiación para esa agencia" });
            }
            return res.status(200).json({ data:rows, message: "Se obtuvo registros" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function getAgenciaUbicacionByCodigo(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        const ubicacionagencia: UbicacionAgencia = body;
        if(ubicacionagencia.c_compania && ubicacionagencia.c_agencia ) {
            const conn = await connect();
            const [rows, fields] = await conn.query('SELECT * FROM prestaya.ma_ubicacionagencia where c_compania=? AND c_agencia=?',[ubicacionagencia.c_compania,ubicacionagencia.c_agencia])
            await conn.end();
            const ubicacionagenciaRes =rows as [UbicacionAgencia];
            if(!ubicacionagenciaRes[0]) {
                return res.status(200).json({ data:[], message: "No se encontró ubiación para esa agencia" });
            }
            return res.status(200).json({ data:rows, message: "Se obtuvo registros" });
        }return res.status(200).json({ message: "Se debe enviar la compañía y agencia para listar la ubicación" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}


export async function updateUbicacionAgencia(req: Request, res: Response): Promise<Response> {
    try {
        //Obtener datos
        const body = req.body;
        const c_compania = body.c_compania;
        const c_agencia = body.c_agencia;
        const c_ubicacion = body.c_ubicacion;
        body.d_ultimafechamodificacion = moment().format('YYYY-MM-DD HH:MM:ss');
        const ubicacionagencia: UbicacionAgencia = req.body;
        const conn = await connect();
        await conn.query('UPDATE prestaya.ma_ubicacionagencia SET ? WHERE c_compania = ? AND c_agencia = ? AND c_ubicacion = ?', [ubicacionagencia, c_compania, c_agencia,c_ubicacion]);
        await conn.end();
        return res.status(200).json({ data: {...ubicacionagencia}, message: "Se actualizó el registro de la ubicacion de la agencia con éxito"  });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error.";
        if(errorAux.errno === 1062) message = "Exite una ubicacion de agencia con esos datos";
        return res.status(500).send({error: error, message: message});
    }
}

export async function deleteUbiacionAgencia(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        const ubicacionagencia: UbicacionAgencia = body;
        if(ubicacionagencia.c_compania && ubicacionagencia.c_agencia && ubicacionagencia.c_ubicacion ) {
            const conn = await connect();
            await conn.query('DELETE FROM prestaya.ma_ubicacionagencia WHERE c_compania = ? AND c_agencia = ? AND c_ubicacion = ?', [ubicacionagencia.c_compania,ubicacionagencia.c_agencia,ubicacionagencia.c_ubicacion ]);
            await conn.end();
            return res.status(200).json({ message: "Se eliminó la ubicación de la agencia con éxito"  });
        }return res.status(200).json({ message: "Se debe enviar el código de la compañía, agencia y ubicación"  });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error.";
        if(errorAux.errno === 1217) message = "No se puede eliminar la ubicación debido a que tiene datos asociados";
        return res.status(500).send({error: error, message: message});
    }
}