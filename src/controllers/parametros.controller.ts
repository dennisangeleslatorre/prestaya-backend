import { Request, Response } from 'express'
import { connect } from '../database'
import { Parametros } from 'interfaces/parametros.interface'
import { ResultSetHeader } from "../interfaces/result"
import moment from 'moment'


export async function getParametros(req: Request, res: Response): Promise<Response> {
    try {
        const c_compania = req.params.c_codigocompania;
        const conn = await connect();
        const [rows, fields] = await conn.query('SELECT * FROM ma_parametros where c_estado="A" AND c_compania=?',[c_compania])
        await conn.end();
        const parametrosRes = rows as [Parametros];
        if(!parametrosRes[0]) {
            return res.status(200).json({data:[], message: "No se encontró parámetros" });
        }
        return res.status(200).json({data:rows, message: "Se obtuvo registros" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function getParametrosAdmin(req: Request, res: Response): Promise<Response> {
    try {
        const conn = await connect();
        const [rows, fields] = await conn.query('SELECT p.c_compania, p.c_parametrocodigo, p.c_descripcion, p.c_tipovalor, p.n_valornumero, p.d_valorfecha, p.c_valortexto, p.c_estado, p.c_usuarioregistro, p.d_fecharegistro, p.c_ultimousuario, p.d_ultimafechamodificacion, c.c_descripcion as companyname FROM ma_parametros p INNER JOIN ma_compania c ON p.c_compania = c.c_compania')
        await conn.end();
        const ParametrosRes = rows as [Parametros];
        if(!ParametrosRes[0]) {
            return res.status(200).json({data:[], message: "No se encontró parámetros" });
        }
        return res.status(200).json({data:rows, message: "Se obtuvo parámetros" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function registerParametros(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        if(body.c_usuarioregistro) {
            body.c_ultimousuario = body.c_usuarioregistro
            if(body.c_compania && body.c_parametrocodigo && body.c_descripcion && body.c_tipovalor) {
                const parametros: Parametros = body;
                const conn = await connect();
                const data = await conn.query('INSERT INTO ma_parametros SET ?', [parametros]);
                await conn.end();
                const parsedRes: ResultSetHeader = data[0] as ResultSetHeader;
                return res.status(200).json({ success: true, data: parametros, message: "Se registró los parámetros con éxito." });
            } return res.status(503).json({message: "Parámetros incompletos. Favor de completar los campos requeridos." });
        } return res.status(503).json({message: "No se está enviando el usuario que realiza el registro." });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error";
        if(errorAux.errno === 1062) message = "Existe un registro con estos datos.";
        return res.status(500).send({error: error, message: message});
    }
}

export async function updateParametro(req: Request, res: Response): Promise<Response> {
    try {
        //Obtener datos
        const body = req.body;
        const c_compania = body.c_compania;
        const c_parametrocodigo = body.c_parametrocodigo;
        body.d_ultimafechamodificacion = moment().format('YYYY-MM-DD HH:MM:ss');
        const parametros: Parametros = req.body;
        const conn = await connect();
        await conn.query('UPDATE ma_parametros SET ? WHERE c_compania = ? AND c_parametrocodigo = ?', [parametros, c_compania, c_parametrocodigo]);
        await conn.end();
        return res.status(200).json({ data: {...parametros}, message: "Se actualizó el parámetro con éxito"  });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error.";
        if(errorAux.errno === 1062) message = "Existe un parámetro con esos datos";
        return res.status(500).send({error: error, message: message});
    }
}

export async function getParametrosByCodigoParametros(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        const parametros: Parametros = body;
        if(parametros.c_compania && parametros.c_parametrocodigo) {
            const conn = await connect();
            const [rows, fields] = await conn.query('SELECT * FROM ma_parametros where c_compania=? AND c_parametrocodigo=?',[parametros.c_compania,parametros.c_parametrocodigo])
            await conn.end();
            const parametrosRes =rows as [Parametros];
            if(!parametrosRes[0]) {
                return res.status(200).json({ data:[], message: "No se encontró parámetros" });
            }
            return res.status(200).json({ data:parametrosRes[0], message: "Se obtuvo registros" });
        }return res.status(200).json({ message: "Se debe enviar el código de compañía y parámetro para listar la información" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function deleteParametro(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        const parametros: Parametros = body;
        if(parametros.c_compania && parametros.c_parametrocodigo ) {
            const conn = await connect();
            await conn.query('DELETE FROM ma_parametros WHERE c_compania = ? AND c_parametrocodigo = ?', [parametros.c_compania,parametros.c_parametrocodigo ]);
            await conn.end();
            return res.status(200).json({ message: "Se eliminó el parámetro con éxito"  });
        }return res.status(200).json({ message: "Se debe enviar el código de la compañía y el parámetro"  });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error.";
        if(errorAux.errno === 1217) message = "No se puede eliminar eliminar el parámetro debido a que tiene datos asociados";
        return res.status(500).send({error: error, message: message});
    }
}