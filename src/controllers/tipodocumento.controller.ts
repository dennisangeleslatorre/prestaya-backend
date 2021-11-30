import { Request, Response } from 'express'
import { connect } from '../database'
import { TipoDocumento } from 'interfaces/tipoDocumento.interface'
import { ResultSetHeader } from "../interfaces/result"
import moment from 'moment'

export async function getTIposDocumento(req: Request, res: Response): Promise<Response> {
    try {
        const conn = await connect();
        const data = await conn.query('SELECT * FROM MA_TIPODOCUMENTO')
        await conn.end();
        const tIposDocumentoRes = data[0] as [TipoDocumento];
        if(!tIposDocumentoRes[0]) {
            return res.status(200).json({ success:false, data:[], message: "No se encontró tipos de documento" });
        }
        return res.status(200).json({ success:true, data:data[0], message: "Se obtuvo registros" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function registerTipoDocumento(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        body.d_fecharegistro = moment().format('YYYY-MM-DD HH:MM:ss');
        if(body.c_codigousuario) body.c_usuarioregistro = body.c_codigousuario;
        body.c_estado = "A";
        const tIpoDocumento: TipoDocumento = body;
        const conn = await connect();
        const data = await conn.query('INSERT INTO MA_TIPODOCUMENTO SET ?', [tIpoDocumento]);
        await conn.end();
        const parsedRes: ResultSetHeader = data[0] as ResultSetHeader;
        return res.status(200).json({ success:true, data: tIpoDocumento, message: "Se registró el tipo de documento con éxito" });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "";
        if(errorAux.errno === 1062) message = "Existe un tipo de documento con esos datos";
        return res.status(500).send({error: error, message: message});
    }
}

export async function updateTipoDocumento(req: Request, res: Response): Promise<Response> {
    try {
        //Obtener datos
        const c_tipodocumento = req.params.c_tipodocumento;
        const body = req.body
        body.d_ultimafechamodificacion = moment().format('YYYY-MM-DD HH:MM:ss');
        if(body.c_codigousuario) body.c_ultimousuario = body.c_codigousuario;
        const tIpoDocumento: TipoDocumento = req.body;
        const conn = await connect();
        await conn.query('UPDATE MA_TIPODOCUMENTO SET ? WHERE c_tipodocumento = ?', [tIpoDocumento, c_tipodocumento]);
        await conn.end();
        return res.status(200).json({ success:true, data: {...tIpoDocumento}, message: "Se actualizó el tipo de documento con éxito"  });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error.";
        if(errorAux.errno === 1062) message = "Existe un tpo de documento con esos datos";
        return res.status(500).send({error: error, message: message});
    }
}

export async function getTipoDocumentoByNPerfil(req: Request, res: Response): Promise<Response> {
    try {
        const c_tipodocumento = req.params.c_tipodocumento;
        const conn = await connect();
        const data = await conn.query('SELECT * FROM MA_TIPODOCUMENTO WHERE c_tipodocumento = ?', [c_tipodocumento]);
        await conn.end();
        const tIpoDocumentoRes = data[0] as [TipoDocumento];
        if(!tIpoDocumentoRes[0]) {
            return res.status(200).json({ success:false, data:{}, message: "No se encontró el tipo de documento" });
        }
        return res.status(200).json({ success:true, data: tIpoDocumentoRes[0], message: "Se obtuvo el tipo de documento con éxito" });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}