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
            return res.status(200).json({ data:[], message: "No se encontró unidades de medida" });
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
            return res.status(200).json({ data:[], message: "No se encontró unidades de medida" });
        }
        return res.status(200).json({ success:true, data:rows, message: "Se obtuvo registros" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function registerUnidadMedida(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
       if(body.c_usuarioregistro) {
            body.c_ultimousuario = body.c_usuarioregistro;
            body.d_fecharegistro = moment().format('YYYY-MM-DD HH:MM:ss');
            if(body.c_unidadmedida && body.c_descripcion ) {
                const unidadMedida: UnidadMedida = body;
                const conn = await connect();
                const data = await conn.query('INSERT INTO MA_UNIDADMEDIDA SET ?', [unidadMedida]);
                await conn.end();
                const parsedRes: ResultSetHeader = data[0] as ResultSetHeader;
                return res.status(200).json({ data: unidadMedida, message: "Se registró la unidad de medida con éxito." });
            }return res.status(200).json({message: "Parámetros incompletos. Favor de completar los campos requeridos." });
       }return res.status(503).json({message: "No se está enviando el usuario que realiza el registro." });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error";
        if(errorAux.errno === 1062) message = "Existe una unidad de medida con esos datos";
        return res.status(500).send({error: error, message: message});
    }
}

export async function getUnidadMedidaByCodigoUnidadMedida(req: Request, res: Response): Promise<Response> {
    try {
        const c_unidadmedida = req.params.c_unidadmedida;
        const conn = await connect();
        const [rows, fields] = await conn.query('SELECT * FROM MA_UNIDADMEDIDA WHERE c_unidadmedida = ?', [c_unidadmedida]);
        await conn.end();
        const unidadMedidaRes = rows as [UnidadMedida];
        if(!unidadMedidaRes[0]) {
            return res.status(200).json({ success: false, data:{}, message: "No se encontró la unidad de medida." });
        }
        return res.status(200).json({ success: true, data: unidadMedidaRes[0], message: "Se obtuvo la unidad de medida con éxito." });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}

export async function updateUnidadMedida(req: Request, res: Response): Promise<Response> {
    try {
        //Obtener datos
        const c_unidadmedida = req.params.c_unidadmedida;
        const body = req.body;
        if(body.c_ultimousuario) {
            body.d_ultimafechamodificacion = moment().format('YYYY-MM-DD HH:MM:ss');
            const unidadMedida: UnidadMedida = req.body;
            const conn = await connect();
            await conn.query('UPDATE MA_UNIDADMEDIDA SET ? WHERE c_unidadmedida = ?', [unidadMedida, c_unidadmedida]);
            await conn.end();
            return res.status(200).json({ data: {...unidadMedida}, message: "Se actualizó la unidad de medida con éxito"  });
        }
        return res.status(500).json({ message: "No se está enviando el usuario que realiza la actualización."  });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error.";
        if(errorAux.errno === 1062) message = "Existe una unidad de medida con esos datos";
        return res.status(500).send({error: error, message: message});
    }
}

export async function deleteUnidadMedida(req: Request, res: Response): Promise<Response> {
    try {
        const c_unidadmedida = req.params.c_unidadmedida;
        const conn = await connect();
        await conn.query('DELETE FROM MA_UNIDADMEDIDA WHERE c_unidadmedida = ?', [c_unidadmedida]);
        await conn.end();
        return res.status(200).json({ message: "Se eliminó la undiad de medida con éxito"  });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error.";
        if(errorAux.errno === 1217) message = "No se puede eliminar la unidad de medida debido a que tiene datos asociados";
        return res.status(500).send({error: error, message: message});
    }
}