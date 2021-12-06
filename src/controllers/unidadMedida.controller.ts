import { Request, Response } from 'express'
import { connect } from '../database'
import { UnidadMedida } from 'interfaces/unidadMedida.interface'
import { ResultSetHeader } from "../interfaces/result"
import moment from 'moment'

export async function getUnidadesMedidaAdmin(req: Request, res: Response): Promise<Response> {
    try {
        const conn = await connect();
        const [rows, fields] = await conn.query('SELECT * FROM MA_UNIDADMEDIDA')
        await conn.end();
        const unidadesMedidaRes = rows as [UnidadMedida];
        if(!unidadesMedidaRes[0]) {
            return res.status(200).json({ success:false, data:[], message: "No se encontró unidades de medida" });
        }
        return res.status(200).json({ success:true, data:rows, message: "Se obtuvo registros" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function getUnidadesMedida(req: Request, res: Response): Promise<Response> {
    try {
        const conn = await connect();
        const [rows, fields] = await conn.query('SELECT * FROM MA_UNIDADMEDIDA WHERE c_estado="A"')
        await conn.end();
        const unidadesMedidaRes = rows as [UnidadMedida];
        if(!unidadesMedidaRes[0]) {
            return res.status(200).json({ success:false, data:[], message: "No se encontró unidades de medida" });
        }
        return res.status(200).json({ success:true, data:rows, message: "Se obtuvo registros" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}


/*
export async function registerUnidadMedida(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        body.d_fecharegistro = moment().format('YYYY-MM-DD HH:MM:ss');
        if(body.c_codigousuario) body.c_usuarioregistro = body.c_codigousuario;
        body.c_estado = "A";
        const unidadMedida: UnidadMedida = body;
        const conn = await connect();
        const data = await conn.query('INSERT INTO MA_UNIDADMEDIDA SET ?', [unidadMedida]);
        await conn.end();
        const parsedRes: ResultSetHeader = data[0] as ResultSetHeader;
        return res.status(200).json({ success:true, data: unidadMedida, message: "Se registró la unidad de medida con éxito" });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "";
        if(errorAux.errno === 1062) message = "Existe una unidad de medida con esos datos";
        return res.status(500).send({error: error, message: message});
    }
}

export async function updateUnidadMedida(req: Request, res: Response): Promise<Response> {
    try {
        //Obtener datos
        const c_unidadmedida = req.params.c_unidadmedida;
        const body = req.body
        body.d_ultimafechamodificacion = moment().format('YYYY-MM-DD HH:MM:ss');
        if(body.c_codigousuario) body.c_ultimousuario = body.c_codigousuario;
        const unidadMedida: UnidadMedida = req.body;
        const conn = await connect();
        await conn.query('UPDATE MA_UNIDADMEDIDA SET ? WHERE c_unidadmedida = ?', [unidadMedida, c_unidadmedida]);
        await conn.end();
        return res.status(200).json({ success:true, data: {...unidadMedida}, message: "Se actualizó la unidad de medida con éxito"  });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error.";
        if(errorAux.errno === 1062) message = "Existe una unidad de medida con esos datos";
        return res.status(500).send({error: error, message: message});
    }
}

export async function getUnidadMedidaByNPerfil(req: Request, res: Response): Promise<Response> {
    try {
        const c_unidadmedida = req.params.c_unidadmedida;
        const conn = await connect();
        const data = await conn.query('SELECT * FROM MA_UNIDADMEDIDA WHERE c_unidadmedida = ?', [c_unidadmedida]);
        await conn.end();
        const unidadMedidaRes = data[0] as [UnidadMedida];
        if(!unidadMedidaRes[0]) {
            return res.status(200).json({ success:false, data:{}, message: "No se encontró la unidad de medida" });
        }
        return res.status(200).json({ success:true, data: unidadMedidaRes[0], message: "Se obtuvo la unidad de medida con éxito" });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}*/