import { Request, Response } from 'express'
import { FlujoCajaUsuario, FlujoCajaUsuarioDia, FlujoCajaUsuarioDiaMovimiento, FlujoCajaUsuarioDiaMovimientoProcedure } from 'interfaces/flujoCaja.interface';
import { connect } from '../database'
import { ResultSetHeader } from "../interfaces/result"
import { RowDataPacket } from 'mysql2';
import moment from 'moment'

export async function registerFllujoCaja(req: Request, res: Response): Promise<Response> {
    try {
        const flujoCaja : FlujoCajaUsuario = req.body.flujoCaja;
        const detalles = req.body.detalles;
        if(detalles && flujoCaja.c_compania && flujoCaja.c_agencia && flujoCaja.c_tipofcu && flujoCaja.c_usuariofcu && flujoCaja.d_fechaInicioMov
            && flujoCaja.d_fechaFinMov && flujoCaja.c_monedafcu && flujoCaja.c_estado && flujoCaja.c_observaciones && flujoCaja.c_usuarioregistro) {
            const conn = await connect();
            const [responseValida, column] = await conn.query(`CALL sp_Valida_Datos_FC('${flujoCaja.c_compania}','${flujoCaja.c_agencia}','${flujoCaja.c_usuariofcu}','${flujoCaja.d_fechaInicioMov}','${flujoCaja.d_fechaFinMov}',@respuesta)`)
            const messageValida = responseValida as RowDataPacket;
            if(messageValida[0][0].respuesta === "OK") {
                const [responseFlujo, column2] = await conn.query(`CALL sp_Registrar_Flujo('${flujoCaja.c_compania}','${flujoCaja.c_agencia}','${flujoCaja.c_tipofcu}','${flujoCaja.c_usuariofcu}','${flujoCaja.d_fechaInicioMov}','${flujoCaja.d_fechaFinMov}','${flujoCaja.c_monedafcu}','${flujoCaja.c_estado}','${flujoCaja.c_observaciones}','${flujoCaja.c_usuarioregistro}','${flujoCaja.c_flagsaldoxdia}','${flujoCaja.n_montomaximofc}','${flujoCaja.c_flagrestringexmtomax}',"${detalles}",@respuesta)`);
                await conn.end();
                const responseProcedure = responseFlujo as RowDataPacket;
                const responseMessage = responseProcedure[0][0];
                if(!responseMessage || responseMessage.respuesta === "ERROR") {
                    return res.status(503).json({message: "Campos incompletos." });
                }
                return res.status(200).json({message: "Se registró con éxito el flujo de caja usuario." });
            } else {
                await conn.end();
                return res.status(503).json({message: messageValida[0][0].respuesta });
            }
        }
        return res.status(503).json({message: "Campos incompletos." });
    } catch (error) {
        console.error(error)
        return res.status(500).send({error: error, message:"Ocurrío un error."});
    }
}

export async function updateFlujoCaja(req: Request, res: Response): Promise<Response> {
    try {
        const flujoCaja : FlujoCajaUsuario = req.body.flujoCaja;
        const nuevosDetalles = req.body.nuevosDetalles ? req.body.nuevosDetalles : null;
        const actualizarDetalles = req.body.actualizarDetalles ? req.body.actualizarDetalles : null;
        const eliminarDetalles = req.body.eliminarDetalles ? req.body.eliminarDetalles : null;
        const eliminarMovimientos = req.body.eliminarMovimientos ? req.body.eliminarMovimientos : null;
        if (flujoCaja.c_compania && flujoCaja.c_agencia && flujoCaja.c_tipofcu && flujoCaja.c_usuariofcu && flujoCaja.d_fechaInicioMov && flujoCaja.n_correlativo
            && flujoCaja.d_fechaFinMov && flujoCaja.c_monedafcu && flujoCaja.c_estado && flujoCaja.c_observaciones && flujoCaja.c_ultimousuario) {
            const conn = await connect();

            const [responseValida, column] = await conn.query(`CALL sp_Valida_Datos_FC_Actualizar('${flujoCaja.c_compania}','${flujoCaja.n_correlativo}','${flujoCaja.c_agencia}','${flujoCaja.c_usuariofcu}','${flujoCaja.d_fechaInicioMov}','${flujoCaja.d_fechaFinMov}',@respuesta)`)
            const messageValida = responseValida as RowDataPacket;
            if(messageValida[0][0].respuesta === "OK") {

                const [responseFlujo, column2] = await conn.query(`CALL sp_Actualizar_FlujoCaja('${flujoCaja.c_compania}','${flujoCaja.n_correlativo}','${flujoCaja.c_agencia}','${flujoCaja.c_tipofcu}','${flujoCaja.c_usuariofcu}','${flujoCaja.d_fechaInicioMov}','${flujoCaja.d_fechaFinMov}','${flujoCaja.c_monedafcu}','${flujoCaja.c_estado}','${flujoCaja.c_observaciones}','${flujoCaja.c_flagsaldoxdia}','${flujoCaja.c_ultimousuario}',@respuesta)`)
                const responseProcedure = responseFlujo as RowDataPacket;
                const responseMessage = responseProcedure[0][0];

                if(!responseMessage || responseMessage.respuesta === "ERROR") {
                    await conn.end();
                    return res.status(503).json({message: "Campos incompletos." });
                } else {
                    if(eliminarMovimientos) {
                        await conn.query(
                        `CALL sp_eliminar_movimientos('${flujoCaja.c_compania}','${flujoCaja.n_correlativo}',"${eliminarMovimientos}",@respuesta)`
                        )
                    }
                    if(eliminarDetalles) {
                        console.log("eliminarDetalles", eliminarDetalles);
                        await conn.query(
                        `CALL sp_Eliminar_Dias_FlujoCaja('${flujoCaja.c_compania}','${flujoCaja.n_correlativo}',"${eliminarDetalles}",@respuesta)`
                        )
                    }
                    if(actualizarDetalles) {
                        await conn.query(
                        `CALL sp_Actualizar_Dias_FlujoCaja('${flujoCaja.c_compania}','${flujoCaja.n_correlativo}','${flujoCaja.c_ultimousuario}',"${actualizarDetalles}",@respuesta)`
                        )
                    }
                    if(nuevosDetalles) {
                        await conn.query(
                        `CALL sp_Nuevos_Dias_FlujoCaja('${flujoCaja.c_compania}','${flujoCaja.n_correlativo}','${flujoCaja.c_ultimousuario}',"${nuevosDetalles}",@respuesta)`
                        )
                    }
                }

            } else {
                await conn.end();
                return res.status(503).json({message: messageValida[0][0].respuesta });
            }

            await conn.end();

            return res.status(200).json({message: "Se actualizó con éxito el flujo de caja usuario." });
        }
        return res.status(503).json({message: "Campos incompletos al enviar." });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error);
    }
}

export async function getFlujoCajaDinamico(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        body.c_compania	= body.c_compania ? body.c_compania : null;
        body.c_agencia = body.c_agencia ? body.c_agencia : null;
        body.c_estado = body.c_estado ? body.c_estado : null;
        body.c_tipofcu = body.c_tipofcu ? body.c_tipofcu : null;
        body.c_usuariofcu = body.c_usuariofcu ? body.c_usuariofcu : null;
        body.d_fecharegistroinicio = body.d_fecharegistroinicio ? body.d_fecharegistroinicio : null;
        body.d_fecharegistrofin	= body.d_fecharegistrofin ? body.d_fecharegistrofin : null;
        body.d_fechamovimientoinicio = body.d_fechamovimientoinicio ? body.d_fechamovimientoinicio : null;
        body.d_fechamovimientofin = body.d_fechamovimientofin ? body.d_fechamovimientofin : null;

        if(body) {
            const conn = await connect();
            const [responseFlujo, column2] : [any, any] = await conn.query(`CALL sp_ListarDinamico_FlujoCaja(?,?,?,?,?,?,?,?,?)`, [body.c_compania,body.c_agencia,body.c_estado,body.c_tipofcu,body.c_usuariofcu,body.d_fecharegistroinicio,body.d_fecharegistrofin,body.d_fechamovimientoinicio,body.d_fechamovimientofin]);
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

export async function getFlujoCajaDiasByCodigo(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        if(body.c_compania && body.n_correlativo) {
            const conn = await connect();
            const [rows, fields] = await conn.query('SELECT * FROM co_flujocudia where c_compania=? AND n_correlativo=?',[body.c_compania, body.n_correlativo])
            await conn.end();
            const detallesRes = rows as [any];
            if(!detallesRes[0]) {
                return res.status(200).json({ data:[], message: "No se encontró registros" });
            }
            return res.status(200).json({ data:detallesRes, message: "Se obtuvo registros" });
        }
        return res.status(503).json({ message: "Se debe enviar compañía y correlativo." });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error);
    }
}

export async function getFlujoCajaMovimientosByCodigo(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        if(body.c_compania && body.n_correlativo && body.d_fechamov) {
            const conn = await connect();
            const [rows, fields] =
                await conn.query('SELECT mov.*, tipo.c_descricpion as c_tipomovimientoccdesc FROM co_flujocudiamov mov INNER JOIN ma_tipomovimientocaja tipo ON mov.c_tipomovimientocc = tipo.c_tipomovimientocc where mov.c_compania=? AND mov.n_correlativo=? AND mov.d_fechamov=?',
                [body.c_compania, body.n_correlativo, body.d_fechamov])
            await conn.end();
            const movimientosRes = rows as [any];
            if(!movimientosRes[0]) {
                return res.status(200).json({ data:[], message: "No se encontró registros" });
            }
            return res.status(200).json({ data:movimientosRes, message: "Se obtuvo registros" });
        }
        return res.status(503).json({ message: "Se debe enviar compañía y correlativo." });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error);
    }
}

export async function getFlujoCajaByCodigo(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        if(body.c_compania && body.n_correlativo) {
            const conn = await connect();
            const [responseFlujo, column2] : [any, any] = await conn.query(`CALL sp_Obtener_FlujoCajaUsuario(?,?)`, [body.c_compania,body.n_correlativo]);
            await conn.end();
            const flujosCajaUsuario = responseFlujo[0] as [any];
            if(flujosCajaUsuario[0]) {
                let flujosDetallesTemporal : Array<FlujoCajaUsuarioDia>  = [];
                let flujosDetallesNuevo : Array<FlujoCajaUsuarioDia>  = [];
                flujosCajaUsuario.forEach((item : FlujoCajaUsuarioDiaMovimientoProcedure, index : number) => {
                    const fechaFormat = moment(item.d_fechamov).format('yyyy-MM-DD');
                    let detalle = {
                        general: {
                            d_fechamov: fechaFormat,
                            c_estado: item.estadodetalle,
                            c_observaciones: item.observacionesdetalle,
                            c_usuarioregistro: item.usuarioregistrodetalle,
                            d_fecharegistro: item.fecharegistrodetalle,
                            c_ultimousuario: item.usuariomodificaciondetalle,
                            d_ultimafechamodificacion: item.fechamodificaciondetalle
                        }
                    };
                    if(item.n_secuencia) {
                        let movimiento : FlujoCajaUsuarioDiaMovimiento = {
                            n_secuencia: item.n_secuencia,
                            c_tipomovimientocc: item.c_tipomovimientocc,
                            c_usuariomovimiento: item.c_usuariomovimiento,
                            c_observaciones: item.observacionesmovimiento.replace(/['"]+/g, ''),
                            n_montoxdiamov: item.n_montoxdiamov,
                            c_usuarioregistro: item.usuarioregistromovimiento,
                            d_fecharegistro: item.fecharegistromovimiento,
                            c_ultimousuario: item.usuariomodificacionmovimiento,
                            d_ultimafechamodificacion: item.fechamodificacionmovimiento,
                            c_prestamo: item.c_prestamo,
                            n_linea: item.n_linea,
                            c_flagxconfirmar: item.c_flagxconfirmar,
                            c_flagconfirmado: item.c_flagconfirmado,
                            c_usuarioconfirmado: item.c_usuarioconfirmado,
                            d_fechaconfirmado:item.d_fechaconfirmado
                        };
                        flujosDetallesTemporal = flujosDetallesNuevo.filter((detalle : FlujoCajaUsuarioDia) => detalle["general"]["d_fechamov"] === fechaFormat);
                        if(flujosDetallesTemporal.length>0){
                            let listmov = [...flujosDetallesNuevo[flujosDetallesNuevo.indexOf(flujosDetallesTemporal[0])]["movimientos"]];
                            flujosDetallesNuevo[flujosDetallesNuevo.indexOf(flujosDetallesTemporal[0])]["movimientos"] = [...listmov, movimiento];
                        } else {
                            flujosDetallesNuevo.push({...detalle, movimientos:[movimiento]});
                        }
                    } else {
                        flujosDetallesNuevo.push({...detalle, movimientos:[]});
                    }
                });

                return res.status(200).json({data:{ general: {
                    c_compania: flujosCajaUsuario[0].c_compania,
                    n_correlativo: flujosCajaUsuario[0].n_correlativo,
                    c_agencia: flujosCajaUsuario[0].c_agencia,
                    c_tipofcu: flujosCajaUsuario[0].c_tipofcu,
                    c_usuariofcu: flujosCajaUsuario[0].c_usuariofcu,
                    d_fechaInicioMov: flujosCajaUsuario[0].d_fechaInicioMov,
                    d_fechaFinMov: flujosCajaUsuario[0].d_fechaFinMov,
                    c_monedafcu: flujosCajaUsuario[0].c_monedafcu,
                    c_estado: flujosCajaUsuario[0].c_estado,
                    c_observaciones: flujosCajaUsuario[0].c_observaciones,
                    c_usuarioregistro: flujosCajaUsuario[0].c_usuarioregistro,
                    d_fecharegistro: flujosCajaUsuario[0].d_fecharegistro,
                    c_ultimousuario: flujosCajaUsuario[0].c_ultimousuario,
                    d_ultimafechamodificacion: flujosCajaUsuario[0].d_ultimafechamodificacion,
                    c_flagsaldoxdia: flujosCajaUsuario[0].c_flagsaldoxdia,
                }, detalles: flujosDetallesNuevo}, message: "Se obtuvo registros." });
            }
            return res.status(503).json({data:[], message: "No se encontraron registros." });
        }
        return res.status(503).json({ message: "Se debe enviar compañía y correlativo." });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error);
    }
}

export async function getMovimientosCajaUsuarioxConfirmar(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        if(body.c_compania) {
            body.c_usuariofcu = body.c_usuariofcu ? body.c_usuariofcu : null;
            const conn = await connect();
            const [response, column2] : [any, any] = await conn.query(`CALL sp_Obtener_Movimientos_Por_Confirmar(?,?)`, [body.c_compania,body.c_usuariofcu]);
            await conn.end();
            const movimientosRes = response as RowDataPacket;
            return res.status(200).json({ data:movimientosRes[0], message: "Se obtuvo registros." });
        }
        return res.status(503).json({ message: "Se debe enviar compañía y correlativo." });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error);
    }
}

export async function confirmarMovimiento(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        if(body.c_compania, body.n_correlativo, body.d_fechamov, body.n_secuencia, body.c_agencia, body.usuario_confirma, body.c_usuariofcu,
            body.c_usuariomovimiento, body.n_montoxdiamov, body.c_tipomovimientoccinverso, body.c_observacionesmov) {
            const conn = await connect();
            const [response, column2] : [any, any] = await conn.query(
                `CALL sp_Confirmar_Movimiento(?,?,?,?,?,?,?,?,?,?,?,@respuesta)`,
            [ body.c_compania, body.n_correlativo, body.d_fechamov, body.n_secuencia, body.c_agencia, body.usuario_confirma, body.c_usuariofcu,
              body.c_usuariomovimiento, body.n_montoxdiamov, body.c_tipomovimientoccinverso, body.c_observacionesmov ]);
            await conn.end();
            const movimientosRes = response as RowDataPacket;
            return res.status(200).json({ message: movimientosRes[0][0].respuesta });
        }
        return res.status(503).json({ message: "Falta enviar datos." });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error);
    }
}

export async function getCajaUsuarioByAgenciaAndUsuario(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        if(body.c_compania && body.c_agencia && body.c_usuariofcu) {
            const conn = await connect();
            const [rows, fields] =
                await conn.query(`
                    SELECT * FROM prestaya.co_flujocu
                    where c_compania = ?
                    AND c_agencia = ?
                    AND c_usuariofcu = ?
                    AND c_estado = 'A';
                `,
                [body.c_compania, body.c_agencia, body.c_usuariofcu])
            await conn.end();
            const movimientosRes = rows as [any];
            if(!movimientosRes[0]) {
                return res.status(200).json({ data:[], message: "No se encontró caja usuario" });
            }
            return res.status(200).json({ data:movimientosRes, message: "Se obtuvo registros" });
        }
        return res.status(503).json({ message: "Se debe enviar compañía, agencia y usuario." });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error);
    }
}