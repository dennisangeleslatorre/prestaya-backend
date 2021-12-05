import { Request, Response } from 'express'
import { connect } from '../database'
import { Pais } from 'interfaces/pais.interface'
import { ResultSetHeader } from "../interfaces/result"

export async function getPaises(req: Request, res: Response): Promise<Response> {
    try {
        const conn = await connect();
        const data = await conn.query('SELECT * FROM MA_PAIS')
        await conn.end();
        const paisesRes = data[0] as [Pais];
        if(!paisesRes[0]) {
            return res.status(200).json({data:[], message: "No se encontró paises" });
        }
        return res.status(200).json({data:data[0], message: "Se obtuvo registros" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function registerPais(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
       if(body.c_usuarioregistro) {
            body.c_ultimousuario = body.c_usuarioregistro
            if(body.c_paiscodigo && body.c_descripcion ) {
                const pais: Pais = body;
                const conn = await connect();
                const data = await conn.query('INSERT INTO MA_PAIS SET ?', [pais]);
                await conn.end();
                const parsedRes: ResultSetHeader = data[0] as ResultSetHeader;
                return res.status(200).json({ data: pais, message: "Se registró el pais con éxito." });
            }return res.status(200).json({message: "Parámetros incompletos. Favor de completar los campos requeridos." });
       }return res.status(503).json({message: "No se está enviando el usuario que realiza el registro." });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error";
        if(errorAux.errno === 1062) message = "Existe un pais con esos datos";
        return res.status(500).send({error: error, message: message});
    }
}

/*
export async function updatePais(req: Request, res: Response): Promise<Response> {
    try {
        //Obtener datos
        const c_paiscodigo = req.params.c_paiscodigo;
        const body = req.body
        body.d_ultimafechamodificacion = moment().format('YYYY-MM-DD HH:MM:ss');
        if(body.c_codigousuario) body.c_ultimousuario = body.c_codigousuario;
        const pais: Pais = req.body;
        const conn = await connect();
        await conn.query('UPDATE MA_PAIS SET ? WHERE c_paiscodigo = ?', [pais, c_paiscodigo]);
        await conn.end();
        return res.status(200).json({ success:true, data: {...pais}, message: "Se actualizó el pais con éxito"  });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error.";
        if(errorAux.errno === 1062) message = "Existe un pais con esos datos";
        return res.status(500).send({error: error, message: message});
    }
}

export async function getPaisByPaisCodigo(req: Request, res: Response): Promise<Response> {
    try {
        const c_paiscodigo = req.params.c_paiscodigo;
        const conn = await connect();
        const data = await conn.query('SELECT * FROM MA_PAIS WHERE c_paiscodigo = ?', [c_paiscodigo]);
        await conn.end();
        const paisRes = data[0] as [Pais];
        if(!paisRes[0]) {
            return res.status(200).json({ success:false, data:{}, message: "No se encontró el pais" });
        }
        return res.status(200).json({ success:true, data: paisRes[0], message: "Se obtuvo el pais con éxito" });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}*/