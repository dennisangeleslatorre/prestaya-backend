import { Request, Response } from 'express'
import { connect } from '../database'
import { Compania } from 'interfaces/compania.interface'
import { ResultSetHeader } from "../interfaces/result"
import moment from 'moment'

export async function getCompanias(req: Request, res: Response): Promise<Response> {
    try {
        const conn = await connect();
        const data = await conn.query('SELECT * FROM MA_COMPANIA')
        await conn.end();
        const companiasRes = data[0] as [Compania];
        if(!companiasRes[0]) {
            return res.status(200).json({ success:false, data:[], message: "No se encontró datos" });
        }
        return res.status(200).json({ success:true, data:data[0], message: "Se obtuvo registros" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function registerCompania(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        body.d_fecharegistro = moment().format('YYYY-MM-DD HH:MM:ss');
        if(body.c_codigousuario) body.c_usuarioregistro = body.c_codigousuario;
        body.c_estado = "A";
        const compania: Compania = body;
        const conn = await connect();
        const data = await conn.query('INSERT INTO MA_COMPANIA SET ?', [compania]);
        await conn.end();
        const parsedRes: ResultSetHeader = data[0] as ResultSetHeader;
        return res.status(200).json({ success:true, data: compania, message: "Se registró la compañía con éxito" });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "";
        if(errorAux.errno === 1062) message = "Existe un rol con esos datos";
        return res.status(500).send({error: error, message: message});
    }
}

export async function updateCompania(req: Request, res: Response): Promise<Response> {
    try {
        //Obtener datos
        const c_compania = req.params.c_compania;
        const body = req.body
        body.d_ultimafechamodificacion = moment().format('YYYY-MM-DD HH:MM:ss');
        if(body.c_codigousuario) body.c_ultimousuario = body.c_codigousuario;
        const compania: Compania = req.body;
        const conn = await connect();
        await conn.query('UPDATE MA_COMPANIA SET ? WHERE c_compania = ?', [compania, c_compania]);
        await conn.end();
        return res.status(200).json({ success:true, data: {...compania}, message: "Se actualizó la compañía con éxito"  });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error.";
        if(errorAux.errno === 1062) message = "Existe una compañía con esos datos";
        return res.status(500).send({error: error, message: message});
    }
}

export async function getCompaniaByCCompania(req: Request, res: Response): Promise<Response> {
    try {
        const c_compania = req.params.c_compania;
        const conn = await connect();
        const data = await conn.query('SELECT * FROM MA_COMPANIA WHERE c_compania = ?', [c_compania]);
        await conn.end();
        const companiaRes = data[0] as [Compania];
        if(!companiaRes[0]) {
            return res.status(200).json({ success:false, data:{}, message: "No se encontró la compañía" });
        }
        return res.status(200).json({ success:true, data: companiaRes[0], message: "Se obtuvo la compañía con éxito" });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}