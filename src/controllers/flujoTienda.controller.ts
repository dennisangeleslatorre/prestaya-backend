import { Request, Response } from 'express'
import { FlujoCTienda,FlujoCTiendaDia,FlujoCajaUsuarioDiaMovimiento } from 'interfaces/flujoTienda.interface';
import { connect } from '../database'
import { ResultSetHeader } from "../interfaces/result"
import { RowDataPacket } from 'mysql2';
import moment from 'moment'


export async function getFlujoCajaTiendaDinamico(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        body.c_compania	             = body.c_compania         ? body.c_compania : null;
        body.c_agencia               = body.c_agencia          ? body.c_agencia : null;
        body.c_estado                = body.c_estado           ? body.c_estado : null;
        body.c_tipofctienda          = body.c_tipofctienda     ? body.c_tipofctienda : null;
        body.c_usuariofctienda       = body.c_usuariofctienda  ? body.c_usuariofctienda : null;
        body.c_usuarioregistro	     = body.c_usuarioregistro  ? body.c_usuarioregistro : null
        body.c_codigousuario	     = body.c_codigousuario	   ? body.c_codigousuario : null
        if(body) {
            const conn = await connect();
            const [responseFlujo, column2] : [any, any] = await conn.query(`CALL prestaya.sp_ListarDinamico_FlujoTienda(?,?,?,?,?,?,?)`, [body.c_compania,body.c_agencia,body.c_estado,body.c_tipofctienda,body.c_usuariofctienda,body.c_usuarioregistro,body.c_codigousuario]);
            const flujosCajaUsuario = responseFlujo[0] as [any];
            await conn.end();
            if(flujosCajaUsuario[0]) {
                return res.status(200).json({data:flujosCajaUsuario, message: "Se obtuvo registros." });
            }
            return res.status(200).json({data:[], message: "No se encontraron registros." });
        }
        return res.status(503).json({ message: "Se debe enviar algún dato para filtrar." });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error);
    }
}

export async function getFlujoCajaTiendaDiaDinamico(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        if(body.c_compania && body.n_correlativo) {
            const conn = await connect();
            const [response, column2] : [any, any] = await conn.query(`CALL prestaya.sp_ListarDinamico_FlujoTiendaDia(?,?)`,[body.c_compania,body.n_correlativo]);
            const movimientosRes = response[0] as [any];
            await conn.end();
            if(movimientosRes[0]) {
                return res.status(200).json({data:movimientosRes, message: "Se obtuvo registros." });
            }
            return res.status(200).json({data:[], message: "No se encontraron registros." });
        }
        return res.status(503).json({ message: "Se debe enviar compañía y correlativo." });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error);
    }
}

export async function getFlujoCajaTiendaDiaMovDinamico(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        if(body.c_compania && body.n_correlativo) {
            body.d_fechamovinicio	        = body.d_fechamovinicio       ? body.d_fechamovinicio : null;
            body.d_fechamovfin              = body.d_fechamovfin          ? body.d_fechamovfin : null;
            const conn = await connect();
            const [response, column2] : [any, any] = await conn.query(`CALL prestaya.sp_ListarDinamico_FlujoTiendaDiaMov(?,?,?,?)`,[body.c_compania,body.n_correlativo,body.d_fechamovinicio,body.d_fechamovfin]);
            const movimientosRes = response[0] as [any];
            await conn.end();
            if(movimientosRes[0]) {
                return res.status(200).json({data:movimientosRes, message: "Se obtuvo registros." });
            }
            return res.status(200).json({data:[], message: "No se encontraron registros." });
        }
        return res.status(503).json({ message: "Se debe enviar compañía y correlativo." });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error);
    }
}

export async function registerFlujoTienda(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        if(body.c_compania && body.c_agencia && body.c_tipofctienda && body.c_usuariofctienda && body.d_fechaInicioMov && body.d_fechaFinMov && body.c_monedafctienda
            && body.c_estado && body.c_observaciones && body.c_usuarioregistro && body.listdetalledia) {
            const conn = await connect();
            const [response, column] : [any, any] = await conn.query(`CALL prestaya.sp_Registrar_FlujoTienda(?,?,?,?,?,?,?,?,?,?,?,@respuesta)`,[body.c_compania,body.c_agencia,body.c_tipofctienda,body.c_usuariofctienda,
            body.d_fechaInicioMov,body.d_fechaFinMov,body.c_monedafctienda,body.c_estado,body.c_observaciones,body.c_usuarioregistro,body.listdetalledia]);
            const messageValida = response as RowDataPacket;
            await conn.end();
            if(messageValida[0][0].respuesta === "OK") {
                return res.status(200).json({message: "Se registró con éxito el flujo de caja usuario." });
            }
            return res.status(503).json({message: "Campos incompletos." });
        }
        return res.status(503).json({ message: "Se debe enviar compañía, los campos obligatorios." });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error);
    }
}