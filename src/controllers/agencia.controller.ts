import { Request, Response } from 'express'
import { connect } from '../database'
import { Agencia, RequestAgenciaByRole } from '../interfaces/agencia.interface'
import { ResultSetHeader, Result } from "../interfaces/result"
import moment from 'moment'

export async function getAgencia(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        const agencia: Agencia = body;
        if(agencia.c_compania) {
            const conn = await connect();
            const [rows, fields] = await conn.query('SELECT * FROM ma_agencia where c_estado="A" AND c_compania=?',[agencia.c_compania])
            await conn.end();
            const agenciaRes =rows as [Agencia];
            if(!agenciaRes[0]) {
                return res.status(200).json({ data:[], message: "No se encontró agencias" });
            }
            return res.status(200).json({ data:rows, message: "Se obtuvo registros" });
        }return res.status(200).json({ message: "Se debe enviar la compañía para listar los agencias" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function getAgenciaAdmin(req: Request, res: Response) {
    try {
        const conn = await connect();
        const [rows, fields] = await conn.query('SELECT a.c_compania, a.c_agencia, a.c_descripcion, a.c_estado, a.c_usuarioregistro, a.d_fecharegistro, a.c_ultimousuario, a.d_ultimafechamodificacion, c.c_descripcion as companyname, IF(a.c_flagvalidacju ="N","NO","SI") AS flagvalidacu, a.c_sufijoprestamo, a.c_sufijoproducto, IF(a.validatransaccionconfirmada ="N","NO","SI") as validatransaccionconfirmada FROM ma_agencia a INNER JOIN ma_compania c ON a.c_compania = c.c_compania');
        await conn.end();
        const agenciaRes = rows as [Agencia];
        if(!agenciaRes[0]) {
            return res.status(200).json({ success: false, data:[], message: "No se encontró agencias." });
        }
        return res.status(200).json({ success: true, data:rows, message: "Se obtuvo agencias." });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

/* ARREGLAR DE ACA */
export async function registerAgencia(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        if(body.c_usuarioregistro) {
            body.c_ultimousuario = body.c_usuarioregistro;
            if(body.c_compania && body.c_agencia && body.c_descripcion) {
                const agencia: Agencia = body;
                const conn = await connect();
                const data = await conn.query('INSERT INTO ma_agencia SET ?', [agencia]);
                await conn.end();
                const parsedRes: ResultSetHeader = data[0] as ResultSetHeader;
                return res.status(200).json({ success: true, data: agencia, message: "Se registró la agencia con éxito." });
            } return res.status(503).json({message: "Parámetros incompletos. Favor de completar los campos requeridos." });
        } return res.status(503).json({message: "No se está enviando el usuario que realiza el registro." });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error";
        if(errorAux.errno === 1062) message = "Existe una agencia con esos datos.";
        return res.status(500).send({error: error, message: message});
    }
}


export async function getAgenciaByCodigoAgencia(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        const agencia: Agencia = body;
        if(agencia.c_compania && agencia.c_agencia) {
            const conn = await connect();
            const [rows, fields] = await conn.query('SELECT * FROM ma_agencia where c_compania=? AND c_agencia=?',[agencia.c_compania,agencia.c_agencia])
            await conn.end();
            const agenciaRes =rows as [Agencia];
            if(!agenciaRes[0]) {
                return res.status(200).json({ data:[], message: "No se encontró agencias" });
            }
            return res.status(200).json({ data:agenciaRes[0], message: "Se obtuvo registros" });
        }return res.status(200).json({ message: "Se debe enviar el código de compañía y agencia para listar la información de agencia" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function getAgenciaAndCompaniaByCodigo(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        const agencia: Agencia = body;
        if(agencia.c_compania && agencia.c_agencia) {
            const conn = await connect();
            const [rows, fields] = await conn.query(
                'SELECT mc.c_compania, mc.c_descripcion as compania_desc, ma.c_agencia, ma.c_descripcion as agencia_desc FROM ma_compania mc INNER JOIN ma_agencia ma ON mc.c_compania=ma.c_compania where ma.c_compania=? AND ma.c_agencia=?',
                [agencia.c_compania,agencia.c_agencia])
            await conn.end();
            const agenciaRes =rows as [Agencia];
            if(!agenciaRes[0]) {
                return res.status(200).json({ data:[], message: "No se encontró agencias" });
            }
            return res.status(200).json({ data:agenciaRes[0], message: "Se obtuvo registros" });
        }return res.status(200).json({ message: "Se debe enviar el código de compañía y agencia para listar la información de agencia" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function updateAgencia(req: Request, res: Response): Promise<Response> {
    try {
        //Obtener datos
        const body = req.body;
        const c_compania = body.c_compania;
        const c_agencia = body.c_agencia;
        body.d_ultimafechamodificacion = moment().format('YYYY-MM-DD HH:MM:ss');
        const agencia: Agencia = req.body;
        const conn = await connect();
        await conn.query('UPDATE ma_agencia SET ? WHERE c_compania = ? AND c_agencia = ?', [agencia, c_compania, c_agencia]);
        await conn.end();
        return res.status(200).json({ data: {...agencia}, message: "Se actualizó la agencia con éxito"  });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error.";
        if(errorAux.errno === 1062) message = "Existe una agencia con esos datos";
        return res.status(500).send({error: error, message: message});
    }
}

export async function deleteAgencia(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        const agencia: Agencia = body;
        if(agencia.c_compania && agencia.c_agencia ) {
            const conn = await connect();
            await conn.query('DELETE FROM ma_agencia WHERE c_compania = ? AND c_agencia = ?', [agencia.c_compania,agencia.c_agencia ]);
            await conn.end();
            return res.status(200).json({ message: "Se eliminó la agencia con éxito"  });
        }return res.status(200).json({ message: "Se debe enviar el código de la compañía y agencia"  });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error.";
        if(errorAux.errno === 1217) message = "No se puede eliminar la agencia debido a que tiene datos asociados";
        return res.status(500).send({error: error, message: message});
    }
}

export async function getAgenciaXPerfil(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        const request: RequestAgenciaByRole = body;
        const conn = await connect();
        let agenciaRes = [];
        if(body.c_compania) {
            if ( request.flagencia ) {
                const [rows, fields] = await conn.query('SELECT * FROM ma_agencia where c_estado="A" AND c_compania=?',[body.c_compania])
                await conn.end();
                agenciaRes = rows as [Agencia];
            }
            else {
                const [rows, fields] = await conn.query(
                    'SELECT ma.c_compania, ma.c_agencia, ma.c_descripcion, ma.c_estado FROM prestaya.ma_agencia ma where ma.c_estado="A" AND c_compania=? AND concat(ma.c_compania,"-",ma.c_agencia) in (?)',
                    [body.c_compania, request.listagencia])
                await conn.end();
                agenciaRes = rows as [Agencia];
            }
            if(!agenciaRes[0]) {
                return res.status(200).json({ data:[], message: "No se encontró agencias" });
            }
            return res.status(200).json({ data:agenciaRes, message: "Se obtuvo registros" });
        } return res.status(200).json({ message: "Se debe enviar la compañía para listar los agencias" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}