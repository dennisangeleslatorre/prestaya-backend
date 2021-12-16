import { Request, Response } from 'express'
import { connect } from '../database'
import { Periodos } from 'interfaces/periodos.interface'
import { ResultSetHeader } from "../interfaces/result"
import moment from 'moment'


export async function getPeriodos(req: Request, res: Response): Promise<Response> {
    try {
        const c_compania = req.params.c_codigocompania;
        const conn = await connect();
        const [rows, fields] = await conn.query('SELECT * FROM MA_PERIODOS where c_estado="A" AND c_compania=?',[c_compania])
        await conn.end();
        const periodosRes = rows as [Periodos];
        if(!periodosRes[0]) {
            return res.status(200).json({data:[], message: "No se encontró periodo" });
        }
        return res.status(200).json({data:rows, message: "Se obtuvo registros" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function getPeriodosAdmin(req: Request, res: Response): Promise<Response> {
    try {
        const conn = await connect();
        const [rows, fields] = await conn.query('SELECT * FROM MA_PERIODOS')
        await conn.end();
        const periodosRes = rows as [Periodos];
        if(!periodosRes[0]) {
            return res.status(200).json({data:[], message: "No se encontró periodos" });
        }
        return res.status(200).json({data:rows, message: "Se obtuvo registros" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function registerPeriodos(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        if(body.c_usuarioregistro) {
            body.c_ultimousuario = body.c_usuarioregistro
            if(body.c_compania && body.c_tipoperiodo && body.c_periodo) {
                const periodos: Periodos = body;
                const conn = await connect();
                const data = await conn.query('INSERT INTO MA_PERIODOS SET ?', [periodos]);
                await conn.end();
                const parsedRes: ResultSetHeader = data[0] as ResultSetHeader;
                return res.status(200).json({ success: true, data: periodos, message: "Se registró los periodos con éxito." });
            } return res.status(503).json({message: "Parámetros incompletos. Favor de completar los campos requeridos." });
        } return res.status(503).json({message: "No se está enviando el usuario que realiza el registro." });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error";
        if(errorAux.errno === 1062) message = "Existe un periodo con esos datos.";
        return res.status(500).send({error: error, message: message});
    }
}

export async function getPeriodosByCodigoPeriodos(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        const periodos: Periodos = body;
        if(periodos.c_compania && periodos.c_tipoperiodo) {
            const conn = await connect();
            const [rows, fields] = await conn.query('SELECT * FROM MA_PERIODOS where c_estado="A" AND c_compania=? AND c_tipoperiodo=?',[periodos.c_compania,periodos.c_tipoperiodo])
            await conn.end();
            const periodosRes =rows as [Periodos];
            if(!periodosRes[0]) {
                return res.status(200).json({ data:[], message: "No se encontró periodos" });
            }
            return res.status(200).json({ data:periodosRes[0], message: "Se obtuvo registros" });
        }return res.status(200).json({ message: "Se debe enviar el código de compañía y tipo periodo para listar la información" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function updatePeriodo(req: Request, res: Response): Promise<Response> {
    try {
        //Obtener datos
        const body = req.body;
        const c_compania = body.c_compania;
        const c_tipoperiodo = body.c_tipoperiodo;
        body.d_ultimafechamodificacion = moment().format('YYYY-MM-DD HH:MM:ss');
        const periodo: Periodos = req.body;
        const conn = await connect();
        await conn.query('UPDATE MA_PERIODOS SET ? WHERE c_compania = ? AND c_tipoperiodo = ?', [periodo, c_compania, c_tipoperiodo]);
        await conn.end();
        return res.status(200).json({ data: {...periodo}, message: "Se actualizó el periodo con éxito"  });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error.";
        if(errorAux.errno === 1062) message = "Existe un periodo con estos datos";
        return res.status(500).send({error: error, message: message});
    }
}

export async function deletePeriodo(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        const periodo: Periodos = body;
        if(periodo.c_compania && periodo.c_tipoperiodo ) {
            const conn = await connect();
            await conn.query('DELETE FROM MA_PERIODOS WHERE c_compania = ? AND c_tipoperiodo = ?', [periodo.c_compania,periodo.c_tipoperiodo]);
            await conn.end();
            return res.status(200).json({ message: "Se eliminó el periodo con éxito"  });
        }return res.status(200).json({ message: "Se debe enviar el código de la compañía y el periodo"  });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error.";
        if(errorAux.errno === 1217) message = "No se puede eliminar eliminar el periodo debido a que tiene datos asociados";
        return res.status(500).send({error: error, message: message});
    }
}