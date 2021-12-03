import { Request, Response } from 'express'
import { connect } from '../database'
import { Agencia } from '../interfaces/agencia.interface'
import { ResultSetHeader, Result } from "../interfaces/result"
import moment from 'moment'
import * as bcrypt from 'bcrypt'

export async function getAgencia(req: Request, res: Response) {
    try {
        const conn = await connect();
        const data = await conn.query('SELECT * FROM MA_AGENCIA WHERE ?');
        await conn.end();
        const agenciaRes = data[0] as [Agencia];
        if(!agenciaRes[0]) {
            return res.status(200).json({ success: false, data:[], message: "No se encontró agencias." });
        }
        return res.status(200).json({ success: true, data:data[0], message: "Se obtuvo agencias." });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

/* ARREGLAR DE ACA */
export async function registerAgencia(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        if(body.c_codigousuario_r) {
            body.c_usuarioregistro = body.c_codigousuario_r;
            if(body.c_codigousuario_r && body.c_compania && body.c_agencia) {
                const agencia: Agencia = body;
                const conn = await connect();
                const data = await conn.query('INSERT INTO MA_AGENCIA SET ?', [agencia]);
                await conn.end();
                const parsedRes: ResultSetHeader = data[0] as ResultSetHeader;
                return res.status(200).json({ success: true, data: agencia, message: "Se registró la agencia con éxito." });
            } return res.status(503).json({message: "Completar los datos obligatorios." });
        } return res.status(503).json({message: "No estas enviando el usuario que realiza el registro" });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error";
        if(errorAux.errno === 1062) message = "Existe una agencia con esos datos.";
        return res.status(500).send({error: error, message: message});
    }
}

/*
export async function updateAgencia(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        body.d_ultimafechamodificacion = moment().format('YYYY-MM-DD HH:MM:ss');//AGREGAR UN CAMPO AL BODY
        if(body.c_codigousuario_m) body.c_ultimousuario = body.c_codigousuario_m;
        if(body.c_clave != undefined){
            body.c_clave = bcrypt.hashSync(body.c_clave, 10)
        }
        const user: User = body;
        const conn = await connect();
        await conn.query('UPDATE MA_USUARIOS SET ? WHERE c_codigousuario = ?', [user, c_codigousuario]);
        await conn.end();
        return res.status(200).json({ success: true, data: {...user, message: "Se actualizó el usuario con éxito." }});
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "";
        if(errorAux.errno === 1062) message = "Existe un usuario con esos datos.";
        return res.status(500).send({error: error, message: message});
    }
}

export async function getAgenciaByCodigoAgencia(req: Request, res: Response): Promise<Response> {
    try {
        const c_codigousuario = req.params.c_codigousuario;
        const conn = await connect();
        const data = await conn.query('SELECT * FROM MA_USUARIOS WHERE c_codigousuario = ?', [c_codigousuario]);
        await conn.end();
        const userRes = data[0] as [Agencia];
        if(!userRes[0]) {
            return res.status(200).json({ success: false, data:{}, message: "No se encontró el usuario." });
        }
        return res.status(200).json({ success: true, data: userRes[0], message: "Se obtuvo el usuario con éxito." });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}
*/