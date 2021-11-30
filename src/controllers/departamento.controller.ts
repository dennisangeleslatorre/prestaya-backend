import { Request, Response } from 'express'
import { connect } from '../database'
import { Departamento } from 'interfaces/departamento.interface'
import { ResultSetHeader } from "../interfaces/result"
import moment from 'moment'

export async function getDepartamentos(req: Request, res: Response): Promise<Response> {
    try {
        const conn = await connect();
        const data = await conn.query('SELECT * FROM MA_DEPARTAMENTO')
        await conn.end();
        const departamentosRes = data[0] as [Departamento];
        if(!departamentosRes[0]) {
            return res.status(200).json({ success:false, data:[], message: "No se encontró departamentos" });
        }
        return res.status(200).json({ success:true, data:data[0], message: "Se obtuvo registros" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function registerDepartamento(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        body.d_fecharegistro = moment().format('YYYY-MM-DD HH:MM:ss');
        if(body.c_codigousuario) body.c_usuarioregistro = body.c_codigousuario;
        body.c_estado = "A";
        const departamento: Departamento = body;
        const conn = await connect();
        const data = await conn.query('INSERT INTO MA_DEPARTAMENTO SET ?', [departamento]);
        await conn.end();
        const parsedRes: ResultSetHeader = data[0] as ResultSetHeader;
        return res.status(200).json({ success:true, data: departamento, message: "Se registró el departamento con éxito" });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "";
        if(errorAux.errno === 1062) message = "Existe un departamento con esos datos";
        return res.status(500).send({error: error, message: message});
    }
}

export async function updateDepartamento(req: Request, res: Response): Promise<Response> {
    try {
        //Obtener datos
        const body = req.body;
        const c_paiscodigo = body.c_paiscodigo;
        const c_departamentocodigo = body.c_departamentocodigo;
        body.d_ultimafechamodificacion = moment().format('YYYY-MM-DD HH:MM:ss');
        if(body.c_codigousuario) body.c_ultimousuario = body.c_codigousuario;
        const departamento: Departamento = req.body;
        const conn = await connect();
        await conn.query('UPDATE MA_DEPARTAMENTO SET ? WHERE c_paiscodigo = ? AND c_departamentocodigo', [departamento, c_paiscodigo, c_departamentocodigo]);
        await conn.end();
        return res.status(200).json({ success:true, data: {...departamento}, message: "Se actualizó el departamento con éxito"  });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error.";
        if(errorAux.errno === 1062) message = "Existe un departamento con esos datos";
        return res.status(500).send({error: error, message: message});
    }
}

export async function getDepartamentoByNPerfil(req: Request, res: Response): Promise<Response> {
    try {
        const c_paiscodigo = req.query.c_paiscodigo;
        const c_departamentocodigo = req.query.c_departamentocodigo;
        const conn = await connect();
        const data = await conn.query('SELECT * FROM MA_DEPARTAMENTO WHERE c_paiscodigo = ? AND c_departamentocodigo', [c_paiscodigo, c_departamentocodigo]);
        await conn.end();
        const departamentoRes = data[0] as [Departamento];
        if(!departamentoRes[0]) {
            return res.status(200).json({ success:false, data:{}, message: "No se encontró el departamento" });
        }
        return res.status(200).json({ success:true, data: departamentoRes[0], message: "Se obtuvo el departamento con éxito" });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}