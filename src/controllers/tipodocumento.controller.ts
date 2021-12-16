import { Request, Response } from 'express'
import { connect } from '../database'
import { TipoDocumento } from 'interfaces/tipoDocumento.interface'
import { ResultSetHeader } from "../interfaces/result"
import moment from 'moment'

export async function getTiposDocumentoAdmin(req: Request, res: Response): Promise<Response> {
    try {
        const conn = await connect();
        const [rows, fields] = await conn.query('SELECT * FROM MA_TIPODOCUMENTO')
        await conn.end();
        const TiposDocumentoRes = rows as [TipoDocumento];
        if(!TiposDocumentoRes[0]) {
            return res.status(200).json({ data:[], message: "No se encontró tipos de documento" });
        }
        return res.status(200).json({ data:rows, message: "Se obtuvo registros" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function getTiposDocumento(req: Request, res: Response): Promise<Response> {
    try {
        const conn = await connect();
        const [rows, fields] = await conn.query('SELECT * FROM MA_TIPODOCUMENTO WHERE c_estado="A"')
        await conn.end();
        const TiposDocumentoRes = rows as [TipoDocumento];
        if(!TiposDocumentoRes[0]) {
            return res.status(200).json({ data:[], message: "No se encontró tipos de documento" });
        }
        return res.status(200).json({ data:rows, message: "Se obtuvo registros" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function registerTipoDocumento(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
       if(body.c_usuarioregistro) {
            body.c_ultimousuario = body.c_usuarioregistro;
            body.d_fecharegistro = moment().format('YYYY-MM-DD HH:MM:ss');
            if(body.c_tipodocumento && body.c_descripcion ) {
                const tipoDocumento: TipoDocumento = body;
                const conn = await connect();
                const data = await conn.query('INSERT INTO MA_TIPODOCUMENTO SET ?', [tipoDocumento]);
                await conn.end();
                const parsedRes: ResultSetHeader = data[0] as ResultSetHeader;
                return res.status(200).json({ data: tipoDocumento, message: "Se registró el tipo de documento con éxito." });
            }return res.status(500).json({message: "Parámetros incompletos. Favor de completar los campos requeridos." });
       }return res.status(500).json({message: "No se está enviando el usuario que realiza el registro." });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error";
        if(errorAux.errno === 1062) message = "Existe un tipo de documento con esos datos";
        return res.status(500).send({error: error, message: message});
    }
}

export async function getTipoDocumentoByCodigoTipoDocumento(req: Request, res: Response): Promise<Response> {
    try {
        const c_tipodocumento = req.params.c_tipodocumento;
        const conn = await connect();
        const [rows, fields] = await conn.query('SELECT * FROM MA_TIPODOCUMENTO WHERE c_tipodocumento = ?', [c_tipodocumento]);
        await conn.end();
        const tipoDocumentoRes = rows as [TipoDocumento];
        if(!tipoDocumentoRes[0]) {
            return res.status(500).json({ success: false, data:{}, message: "No se encontró el tipo de documento." });
        }
        return res.status(200).json({ success: true, data: tipoDocumentoRes[0], message: "Se obtuvo el tipo de documento con éxito." });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}

export async function updateTipoDocumento(req: Request, res: Response): Promise<Response> {
    try {
        //Obtener datos
        const c_tipodocumento = req.params.c_tipodocumento;
        const body = req.body;
        if(body.c_ultimousuario) {
            body.d_ultimafechamodificacion = moment().format('YYYY-MM-DD HH:MM:ss');
            const tipoDocumento: TipoDocumento = body;
            const conn = await connect();
            const resp = await conn.query('UPDATE MA_TIPODOCUMENTO SET ? WHERE c_tipodocumento = ?', [tipoDocumento, c_tipodocumento]);
            console.log("res", resp);
            await conn.end();
            return res.status(200).json({ data: {...tipoDocumento}, message: "Se actualizó el tipo de documento con éxito"  });
        }
        return res.status(500).json({message: "No se está enviando el usuario que realiza la actualización." });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error.";
        if(errorAux.errno === 1062) message = "Existe un tpo de documento con esos datos";
        return res.status(500).send({error: error, message: message});
    }
}

export async function deleteTipoDocumento(req: Request, res: Response): Promise<Response> {
    try {
        const c_tipodocumento = req.params.c_tipodocumento;
        const conn = await connect();
        await conn.query('DELETE FROM MA_TIPODOCUMENTO WHERE c_tipodocumento = ?', [c_tipodocumento]);
        await conn.end();
        return res.status(200).json({ message: "Se eliminó el tipo de documento con éxito"  });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error.";
        if(errorAux.errno === 1217) message = "No se puede eliminar el tipo de documento debido a que tiene datos asociados";
        return res.status(500).send({error: error, message: message});
    }
}
