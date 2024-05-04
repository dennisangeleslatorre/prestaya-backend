import { Request, Response } from 'express'
import { connect } from '../database'
import { PrestamoProducto } from 'interfaces/prestamoProducto.interface'
import { Result } from "../interfaces/result"
import { RowDataPacket } from 'mysql2';
import moment from 'moment'

export async function getProductosByPrestamo(req: Request, res: Response): Promise<Response> {
    try {
        const c_compania = req.body.c_compania;
        const c_prestamo = req.body.c_prestamo;
        const conn = await connect();
        const [rows, fields] = await conn.query(`SELECT pp.*, mt.c_descripcion as tipoProducto, mu.c_descripcion as unidadmedidadesc, mc.c_nombrescompleto, mua.c_descripcion as c_ubicaciondesc
        FROM co_prestamosproductos pp
        INNER JOIN ma_tipoproducto mt ON pp.c_tipoproducto = mt.c_tipoproducto
        INNER JOIN ma_unidadmedida mu ON  pp.c_unidadmedida = mu.c_unidadmedida
        LEFT JOIN ma_ubicacionagencia mua ON pp.c_ubicacion = mua.c_ubicacion
        LEFT JOIN prestaya.ma_clientes mc ON pp.n_cliente=mc.n_cliente
        where pp.c_compania=? AND pp.c_prestamo=?`,[c_compania, c_prestamo]);
        await conn.end();
        const parametrosRes = rows as [PrestamoProducto];
        if(!parametrosRes[0]) {
            return res.status(200).json({data:[], message: "No se encontró productos" });
        }
        return res.status(200).json({data:rows, message: "Se obtuvo registros" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function getProductosByFormato(req: Request, res: Response): Promise<Response> {
    try {
        const c_compania = req.body.c_compania;
        const c_prestamo = req.body.c_prestamo;
        const conn = await connect();
        const [rows, fields] = await conn.query('SELECT p.*, t.c_descripcion as tipoproductodesc, u.c_descripcion as unidadmedidadesc FROM co_prestamosproductos p INNER JOIN  ma_tipoproducto t on t.c_tipoproducto = p.c_tipoproducto INNER JOIN ma_unidadmedida u on u.c_unidadmedida = p.c_unidadmedida where c_compania=? AND c_prestamo=?;',[c_compania, c_prestamo]);
        await conn.end();
        const parametrosRes = rows as [PrestamoProducto];
        if(!parametrosRes[0]) {
            return res.status(200).json({data:[], message: "No se encontró productos" });
        }
        return res.status(200).json({data:rows, message: "Se obtuvo registros" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function updateProductoGarantia(c_compania:string, c_prestamo:string, c_ultimousuario:string, productos:string): Promise<Result> {
    try {
        const conn = await connect();
        const [responseProducts, column2] = await conn.query(`CALL sp_Actualizar_Producto(?,?,?,?,@respuesta)`,[c_compania, c_prestamo, c_ultimousuario, productos]);
        await conn.end();
        const responseProcedure = responseProducts as RowDataPacket;
        const responseMessage = responseProcedure[0][0];
        if(!responseMessage || responseMessage.respuesta === "ERROR") {
            return Promise.reject({ success: false, message:"No se pudo actualizar los productos" });
        }
        return Promise.resolve({ success: true, data: responseMessage.respuesta });
    } catch (error) {
        console.error(error);
        return Promise.reject({ success: false, error });
    }
}

export async function deleteProductoGarantia(c_compania:string, c_prestamo:string, productos:string): Promise<Result> {
    try {
        const conn = await connect();
        const [responseProducts, column2] = await conn.query(`CALL sp_Delete_Producto(?,?,?,@respuesta)`,[c_compania, c_prestamo, productos]);
        await conn.end();
        const responseProcedure = responseProducts as RowDataPacket;
        const responseMessage = responseProcedure[0][0];
        if(!responseMessage || responseMessage.respuesta === "ERROR") {
            return Promise.reject({ success: false, message:"No se pudo actualizar los productos" });
        }
        return Promise.resolve({ success: true, data: responseMessage.respuesta });
    } catch (error) {
        console.error(error);
        return Promise.reject({ success: false, error });
    }
}

export async function insertProductoGarantia(c_compania:string, c_prestamo:string, c_usuarioregistro:string, productos:string): Promise<Result> {
    try {
        const conn = await connect();
        const [responseProducts, column2] = await conn.query(`CALL sp_Registrar_Producto('${c_compania}','${c_prestamo}','${c_usuarioregistro}','${c_usuarioregistro}',"${productos}",@respuesta)`)
        await conn.end();
        const responseProcedure = responseProducts as RowDataPacket;
        console.log("responseProducts", responseProducts);
        const responseMessage = responseProcedure[0][0];
        if(!responseMessage || responseMessage.respuesta === "ERROR") {
            return Promise.reject({ success: false, message:"No se pudo crear los productos" });
        }
        return Promise.resolve({ success: true, data: responseMessage.respuesta });
    } catch (error) {
        console.error(error);
        return Promise.reject({ success: false, error });
    }
}

export async function updateProductoUbicacion(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        if(body.c_usuarioubicacion) {
            if(body.c_compania && body.c_prestamo && body.n_linea && body.c_ubicacion && body.c_observacionubicacion && body.c_subtipoproducto) {
                const conn = await connect();
                const [response, column] = await conn.query(`CALL prestaya.sp_Update_PrestamoProducto_Ubicacion(?,?,?,?,?,?,?,@respuesta)`,[body.c_compania, body.c_prestamo,body.n_linea,body.c_ubicacion,body.c_observacionubicacion,body.c_usuarioubicacion,body.c_subtipoproducto]);
                await conn.end();
                const responseProcedure = response as RowDataPacket;
                const responseMessage = responseProcedure[0][0];
                console.log("resposne",responseMessage )
                if(responseMessage && responseMessage.respuesta === "OK") {
                    return res.status(200).json({message: "Se actualizó con éxito el registro de préstamo producto" });
                } else {
                    return res.status(503).json({message: responseMessage.respuesta });
                }
            }return res.status(503).json({ message: "Se debe enviar los datos obligatorios" });
        } return res.status(503).json({message: "No se está enviando el usuario que realiza el cambio de estado." });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}
