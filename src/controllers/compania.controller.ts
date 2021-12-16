import { Request, Response } from 'express'
import { connect } from '../database'
import { Compania } from 'interfaces/compania.interface'
import { ResultSetHeader } from "../interfaces/result"
import moment from 'moment'


export async function getCompania(req: Request, res: Response): Promise<Response> {
    try {
        const conn = await connect();
        const [rows, fields] = await conn.query('SELECT c_compania,c_descricpion,c_ruc,c_direccion,c_paiscodigo,c_departamentocodigo,c_provinciacodigo,c_distritocodigo FROM  MA_COMPANIA where c_estado="A"')
        await conn.end();
        const tipoCompaniaRes = rows as [Compania];
        if(!tipoCompaniaRes[0]) {
            return res.status(200).json({data:[], message: "No se encontró compañía" });
        }
        return res.status(200).json({data:rows, message: "Se obtuvo registros" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function getCompaniaAdmin(req: Request, res: Response): Promise<Response> {
    try {
        const conn = await connect();
        const [rows, fields] = await conn.query('SELECT * FROM MA_COMPANIA')
        await conn.end();
        const TipoCompaniaRes = rows as [Compania];
        if(!TipoCompaniaRes[0]) {
            return res.status(200).json({data:[], message: "No se encontró compañía" });
        }
        return res.status(200).json({data:rows, message: "Se obtuvo registros" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function registerCompania(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        if(body.c_usuarioregistro) {
            body.c_ultimousuario = body.c_usuarioregistro;
            console.log("Cuerpo", body);
            if(body.c_compania && body.c_ruc && body.c_direccion && body.c_paiscodigo && body.c_departamentocodigo && body.c_provinciacodigo && body.c_distritocodigo) {
                const compania: Compania = body;
                const conn = await connect();
                const data = await conn.query('INSERT INTO MA_COMPANIA SET ?', [compania]);
                await conn.end();
                const parsedRes: ResultSetHeader = data[0] as ResultSetHeader;
                return res.status(200).json({ success: true, data: compania, message: "Se registró la compañía con éxito." });
            } return res.status(503).json({message: "Parámetros incompletos. Favor de completar los campos requeridos." });
        } return res.status(503).json({message: "No se está enviando el usuario que realiza el registro." });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error";
        if(errorAux.errno === 1062) message = "Existe una compañía con esos datos.";
        return res.status(500).send({error: error, message: message});
    }
}

export async function getCompaniaByCodigoCompania(req: Request, res: Response): Promise<Response> {
    try {
        const c_compania = req.params.c_compania;
        const conn = await connect();
        const [rows, fields] = await conn.query('SELECT * FROM MA_COMPANIA WHERE c_compania = ?', [c_compania]);
        await conn.end();
        const companiaRes = rows as [Compania];
        if(!companiaRes[0]) {
            return res.status(200).json({ data:{}, message: "No se encontró la compañía." });
        }
        return res.status(200).json({ data: companiaRes[0], message: "Se obtuvo la compañia." });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}

export async function updateCompania(req: Request, res: Response): Promise<Response> {
    try {
        //Obtener datos
        const body = req.body;
        const c_compania = body.c_compania;
        body.d_ultimafechamodificacion = moment().format('YYYY-MM-DD HH:MM:ss');
        const compania: Compania = req.body;
        const conn = await connect();
        await conn.query('UPDATE MA_COMPANIA SET ? WHERE c_compania = ?', [compania, c_compania]);
        await conn.end();
        return res.status(200).json({ data: {...compania}, message: "Se actualizó la compañía con éxito"  });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error.";
        if(errorAux.errno === 1062) message = "Existe una compañía con esos datos";
        return res.status(500).send({error: error, message: message});
    }
}


export async function deleteCompania(req: Request, res: Response): Promise<Response> {
    try {
        const c_compania = req.params.c_compania;
        const conn = await connect();
        await conn.query('DELETE FROM MA_COMPANIA WHERE c_compania = ?', [c_compania]);
        await conn.end();
        return res.status(200).json({ message: "Se eliminó la compañía con éxito"  });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error.";
        if(errorAux.errno === 1217) message = "No se puede eliminar la compañía debido a que tiene datos asociados";
        return res.status(500).send({error: error, message: message});
    }
}