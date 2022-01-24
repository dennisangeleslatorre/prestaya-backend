import { Request, Response } from 'express'
import { Prestamo } from 'interfaces/prestamo.inteface';
import { PrestamoCancelaciones } from 'interfaces/prestamoCancelaciones.interface';
import { updateProductoGarantia, deleteProductoGarantia, insertProductoGarantia } from '../controllers/prestamoProducto.controller'
import { Result } from "../interfaces/result"
import { connect } from '../database'
import { ResultSetHeader } from "../interfaces/result"
import { RowDataPacket } from 'mysql2';
import moment from 'moment'

export async function getPrestamoByCodigoPrestamo(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        const prestamo: Prestamo = body;
        if(prestamo.c_compania && prestamo.c_prestamo) {
            const conn = await connect();
            const [rows, fields] = await conn.query('SELECT * FROM co_prestamos where c_compania=? AND c_prestamo=?',[prestamo.c_compania,prestamo.c_prestamo])
            await conn.end();
            const prestamoRes =rows as [Prestamo];
            if(!prestamoRes[0]) {
                return res.status(200).json({ message: "No se encontró préstamos" });
            }
            return res.status(200).json({ data:prestamoRes[0], message: "Se obtuvo registros" });
        }return res.status(200).json({ message: "Se debe enviar el código de compañía y código del préstamo para listar la información" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function validateTipos(req: Request, res: Response): Promise<Response> {
    try {
        const ids = req.body.ids;
        const conn = await connect();
        const [response , column] = await conn.query(`call sp_Validar_EstadoProducto("${ids}",@respuesta)`);
        await conn.end();
        const responseProcedure = response as RowDataPacket;
        const responseMessage = responseProcedure[0][0];
        if(responseMessage && responseMessage.respuesta === "OK" ) {
            return res.status(200).send({message: "OK"});
        } else {
            return res.status(503).send({message: "Uno de los tipos no está activo o no existe"});
        }
    } catch (error) {
        console.error(error)
        return res.status(500).send({error: error, message: "Error al consultar tipos"})
    }
}

export async function validateUnidades(req: Request, res: Response): Promise<Response> {
    try {
        const ids = req.body.ids;
        const conn = await connect();
        const [response, column] = await conn.query(`call sp_Validar_EstadoUnidadMedida("${ids}",@respuesta)`);
        await conn.end();
        const responseProcedure = response as RowDataPacket;
        const responseMessage = responseProcedure[0][0];
        if(responseMessage && responseMessage.respuesta === "OK" ) {
            return res.status(200).send({message: "OK"});
        } else {
            return res.status(503).send({message: "Uno de las unidades de media no está activa o no existe"});
        }
    } catch (error) {
        console.error(error)
        return res.status(500).send({error: error, message: "Error al consultar unidades de medida"})
    }
}

export async function registerPrestamo(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body.prestamo;
        const productos = req.body.productos;
        if(body.c_usuarioregistro) {
            body.c_ultimousuario = body.c_usuarioregistro;
            body.c_usuarioregpendiente = body.c_usuarioregistro;
            if(body.c_compania && body.c_agencia && body.n_cliente && body.c_paiscodigo && body.c_departamentocodigo && body.c_provinciacodigo && body.c_distritocodigo) {
                const conn = await connect();
                const [response, column] = await conn.query(`CALL sp_Registrar_Prestamo('${body.c_compania}','${body.c_agencia}','${body.n_cliente}','${body.c_nombrescompleto}','${body.c_tipodocumento}','${body.c_numerodocumento}','${body.c_direccioncliente}','${body.c_paiscodigo}','${body.c_departamentocodigo}','${body.c_provinciacodigo}','${body.c_distritocodigo}','${body.c_telefono1}','${body.c_monedaprestamo}','${body.n_montoprestamo}','${body.n_tasainteres}','${body.n_montointereses}','${body.n_montototalprestamo}','${body.d_fechadesembolso}','${body.n_diasplazo}','${body.d_fechavencimiento}','${body.n_montointeresesdiario}','${body.c_observacionesregistro}','${body.c_usuarioregistro}','${body.c_ultimousuario}','${body.c_usuarioregpendiente}',@respuesta)`);
                await conn.end();
                const responseProcedure = response as RowDataPacket;
                const responseMessage = responseProcedure[0][0];
                if(!responseMessage || responseMessage.respuesta === "ERROR") {
                    return res.status(503).json({message: "Ocurrio un problema al insertar el préstamo" });
                } else {
                    if(productos) {
                        const responseProducts = await insertProductoGarantia(body.c_compania, responseMessage.respuesta, body.c_usuarioregistro, productos);
                        if(responseProducts.success) {
                            return res.status(200).json({message: "Se registró con éxito el préstamo" });
                        } else {
                            return res.status(503).json({message: "Ocurrió un problema al insertar el préstamo" });
                        }
                    }
                    return res.status(200).json({message: "Se registró con éxito el préstamo" });
                }
            }return res.status(503).json({ message: "Se debe enviar los datos obligatorios" });
        } return res.status(503).json({message: "No se está enviando el usuario que realiza el registro." });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function updatePrestamo(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body.prestamo;
        const nuevosProductos = req.body.nuevosProductos;
        const actualizarProductos = req.body.actualizarProductos;
        const eliminarProductos = req.body.eliminarProductos;
        if(body.c_ultimousuario) {
            body.d_ultimafechamodificacion = moment().format('YYYY-MM-DD HH:MM:ss');
            if(body.c_compania && body.c_prestamo && body.n_cliente && body.c_paiscodigo && body.c_departamentocodigo && body.c_provinciacodigo && body.c_distritocodigo) {
                const prestamo: Prestamo = body;
                const conn = await connect();
                const [rows, column] = await conn.query(`UPDATE co_prestamos SET ? WHERE c_compania = ? AND c_prestamo = ? AND c_estado = 'PE'`, [prestamo, body.c_compania, body.c_prestamo]);
                await conn.end();
                const parsedRes: ResultSetHeader = rows as ResultSetHeader;
                if(parsedRes.affectedRows === 1) {
                    //Insertar nuevos productos
                    if(nuevosProductos) {
                        const responseNewProducts = await insertProductoGarantia(body.c_compania, body.c_prestamo, body.c_ultimousuario, nuevosProductos);
                        if(!responseNewProducts.success) {
                            return res.status(503).json({message: "Ocurrió un problema al actualizar el préstamo" });
                        }
                    }
                    if(actualizarProductos) {
                        const responseUpdateProducts = await updateProductoGarantia(body.c_compania, body.c_prestamo, body.c_ultimousuario, actualizarProductos);
                        if(!responseUpdateProducts.success) {
                            return res.status(503).json({message: "Ocurrió un problema al actualizar el préstamo" });
                        }
                    }
                    if(eliminarProductos) {
                        const responseDeleteProducts = await deleteProductoGarantia(body.c_compania, body.c_prestamo, eliminarProductos);
                        if(!responseDeleteProducts.success) {
                            return res.status(503).json({message: "Ocurrió un problema al actualizar el préstamo" });
                        }
                    }
                    return res.status(200).json({ message: "Se actualizó el prestamo con éxito" });
                }
                return res.status(503).json({ message: "Error al actualizar el préstamo" });
            } return res.status(503).json({ message: "Se debe enviar los datos obligatorios" });
        } return res.status(503).json({message: "No se está enviando el usuario que realiza la modificación." });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function getPrestamoDinamico(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        body.c_compania			  		 = body.c_compania				   ? body.c_compania			  	: null
        body.c_agencia			  		 = body.c_agencia				   ? body.c_agencia			  	    : null
        body.c_prestamo			  		 = body.c_prestamo				   ? body.c_prestamo			  	: null
        body.n_cliente			  		 = body.n_cliente			       ? body.n_cliente			  		: '0'
        body.c_nombrescompleto	  		 = body.c_nombrescompleto	       ? body.c_nombrescompleto	  		: null
        body.c_tipodocumento	  		 = body.c_tipodocumento	     	   ? body.c_tipodocumento	      	: null
        body.c_numerodocumento	  		 = body.c_numerodocumento	       ? body.c_numerodocumento	  		: null
        body.c_paiscodigo		  		 = body.c_paiscodigo		       ? body.c_paiscodigo		  		: null
        body.c_departamentocodigo 		 = body.c_departamentocodigo  	   ? body.c_departamentocodigo  	: null
        body.c_provinciacodigo	  		 = body.c_provinciacodigo	       ? body.c_provinciacodigo	  		: null
        body.c_distritocodigo	  		 = body.c_distritocodigo	       ? body.c_distritocodigo	  		: null
        body.c_telefono1		  		 = body.c_telefono1		     	   ? body.c_telefono1		      	: null
        body.d_fechadesembolsoinicio	 = body.d_fechadesembolsoinicio	   ? body.d_fechadesembolsoinicio	: null
        body.d_fechadesembolsofin		 = body.d_fechadesembolsofin	   ? body.d_fechadesembolsofin	  	: null
        body.d_fechavencimientoinicio	 = body.d_fechavencimientoinicio   ? body.d_fechavencimientoinicio	: null
        body.d_fechavencimientofin		 = body.d_fechavencimientofin 	   ? body.d_fechavencimientofin		: null
        body.d_fecharegistroinicio		 = body.d_fecharegistroinicio	   ? body.d_fecharegistroinicio		: null
        body.d_fecharegistrofin			 = body.d_fecharegistrofin	 	   ? body.d_fecharegistrofin		: null
        body.d_fechavigenteinicio	     = body.d_fechavigenteinicio	   ? body.d_fechavigenteinicio		: null
        body.d_fechavigentefin			 = body.d_fechavigentefin	 	   ? body.d_fechavigentefin			: null
        body.d_fechaentregainicio		 = body.d_fechaentregainicio	   ? body.d_fechaentregainicio		: null
        body.d_fechaentregafin			 = body.d_fechaentregafin	       ? body.d_fechaentregafin			: null
        body.d_fechaEntregaUSinicio	  	 = body.d_fechaEntregaUSinicio	   ? body.d_fechaEntregaUSinicio	: null
        body.d_fechaEntregaUSfin		 = body.d_fechaEntregaUSfin	 	   ? body.d_fechaEntregaUSfin		: null
        body.d_fechaanulacioninicio	  	 = body.d_fechaanulacioninicio	   ? body.d_fechaanulacioninicio	: null
        body.d_fechaanulacionfin		 = body.d_fechaanulacionfin	 	   ? body.d_fechaanulacionfin		: null
        body.d_fechaRemateinicio		 = body.d_fechaRemateinicio		   ? body.d_fechaRemateinicio		: null
        body.d_fechaRematefin			 = body.d_fechaRematefin	 	   ? body.d_fechaRematefin			: null
        body.d_fechaRemateUSinicio	   	 = body.d_fechaRemateUSinicio	   ? body.d_fechaRemateUSinicio	    : null
        body.d_fechaRemateUSfin			 = body.d_fechaRemateUSfin	 	   ? body.d_fechaRemateUSfin		: null
        body.d_fecharegpendienteinicio   = body.d_fecharegpendienteinicio  ? body.d_fecharegpendienteinicio : null
        body.d_fecharegpendientefin		 = body.d_fecharegpendientefin	   ? body.d_fecharegpendientefin	: null
        body.d_fechacancelacioninicio	 = body.d_fechacancelacioninicio   ? body.d_fechacancelacioninicio	: null
        body.d_fechacancelacionfin		 = body.d_fechacancelacionfin	   ? body.d_fechacancelacionfin		: null
        body.d_fvencimientoreproinicio	 = body.d_fvencimientoreproinicio  ? body.d_fvencimientoreproinicio	: null
        body.d_fvencimientoreprofin		 = body.d_fvencimientoreprofin	   ? body.d_fvencimientoreprofin		: null

        if(body) {
            const conn = await connect();
            const [[rows,fields], response] = await conn.query(`CALL sp_listDinamico_Prestamo(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,[body.c_compania,body.c_agencia, body.c_prestamo,body.n_cliente,body.c_nombrescompleto,body.c_tipodocumento,body.c_numerodocumento,body.c_paiscodigo,body.c_departamentocodigo,body.c_provinciacodigo,body.c_distritocodigo,body.c_telefono1,body.d_fechadesembolsoinicio,body.d_fechadesembolsofin,body.d_fechavencimientoinicio,body.d_fechavencimientofin,body.d_fecharegistroinicio,body.d_fecharegistrofin,body.d_fechavigenteinicio,body.d_fechavigentefin,body.d_fechaentregainicio,body.d_fechaentregafin,body.d_fechaEntregaUSinicio,body.d_fechaEntregaUSfin,body.d_fechaanulacioninicio,body.d_fechaanulacionfin,body.d_fechaRemateinicio,body.d_fechaRematefin,body.d_fechaRemateUSinicio,body.d_fechaRemateUSfin,body.d_fecharegpendienteinicio,body.d_fecharegpendientefin,body.d_fechacancelacioninicio,body.d_fechacancelacionfin,body.d_fvencimientoreproinicio,body.d_fvencimientoreprofin]);
            await conn.end();
            const prestamoRes = rows as [Prestamo];
            if(!prestamoRes[0]) {
                return res.status(200).json({message: "No se encontró préstamos" });
            }
            return res.status(200).json({data:rows, message: "Se obtuvo préstamos" });
        }return res.status(200).json({ message: "Se debe enviar algún dato para filtrar"  });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}


export async function anularPrestamo(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        if(body.c_usuarioanulacion) {
            if(body.c_compania && body.c_prestamo && body.c_estado && body.c_observacionesanula) {
                const conn = await connect();
                const [response, column] = await conn.query(`CALL sp_Anular_Prestamo(?,?,?,?,?,@respuesta)`,[body.c_compania, body.c_prestamo,body.c_estado,body.c_observacionesanula,body.c_usuarioanulacion]);
                await conn.end();
                const responseProcedure = response as RowDataPacket;
                const responseMessage = responseProcedure[0][0];
                if(!responseMessage || responseMessage.respuesta === "ERROR") {
                    return res.status(503).json({message: "Ocurrio un problema al anular el préstamo" });
                } else {
                    return res.status(200).json({message: "Se anuló con éxito el préstamo" });
                }
            }return res.status(503).json({ message: "Se debe enviar los datos obligatorios" });
        } return res.status(503).json({message: "No se está enviando el usuario que realiza la anulación." });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function validarRetornarPendiente(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        if( body.c_compania && body.c_prestamo ) {
            const conn = await connect();
            const [response, column] = await conn.query(`call sp_Validar_Estado_Retornar_Pendiente(?, ?, @respuesta);`,[body.c_compania, body.c_prestamo]);
            await conn.end();
            const responseProcedure = response as RowDataPacket;
            const responseMessage = responseProcedure[0][0];
            if(!responseMessage || responseMessage.respuesta !== "OK") {
                const message = responseMessage.respuesta ? responseMessage.respuesta : "Error al validar el préstamo."
                return res.status(503).json({message: message});
            }
            return res.status(200).json({message: responseMessage.respuesta });
        } else
            return res.status(503).json({message: "No se está enviando la compañía o el código del préstamo." });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function retornarPendiente(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        if( body.c_compania && body.c_prestamo ) {
            const conn = await connect();
            const [response, column] = await conn.query(`call sp_Retornar_Pendiente(?, ?, @respuesta);`,[body.c_compania, body.c_prestamo]);
            await conn.end();
            const responseProcedure = response as RowDataPacket;
            const responseMessage = responseProcedure[0][0];
            if(!responseMessage || responseMessage.respuesta !== "OK") {
                const message = responseMessage.respuesta ? responseMessage.respuesta : "Error al retornar el préstamo a pendiente."
                return res.status(503).json({message: message});
            }
            return res.status(200).json({message: responseMessage.respuesta });
        } else
            return res.status(503).json({message: "No se está enviando la compañía o el código del préstamo." });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function validarFechaRemate(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        if( body.c_compania && body.c_prestamo && body.d_fechaRemate ) {
            const conn = await connect();
            const [response, column] = await conn.query(`call sp_Validar_Fecha_Remate(?, ?, ?, @respuesta);`,[body.c_compania, body.c_prestamo, body.d_fechaRemate]);
            await conn.end();
            const responseProcedure = response as RowDataPacket;
            const responseMessage = responseProcedure[0][0];
            if(!responseMessage || responseMessage.respuesta !== "OK") {
                const message = responseMessage.respuesta ? responseMessage.respuesta : "Error al validar el préstamo."
                return res.status(503).json({message: message});
            }
            return res.status(200).json({message: responseMessage.respuesta });
        } else
            return res.status(503).json({message: "No se está enviando la compañía, el código del préstamo o la fecha de remate." });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function validarEstadoRemate(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        if( body.c_compania && body.c_prestamo ) {
            const conn = await connect();
            const [response, column] = await conn.query(`call sp_Validar_Estado_Remate(?, ?, @respuesta);`,[body.c_compania, body.c_prestamo]);
            await conn.end();
            const responseProcedure = response as RowDataPacket;
            const responseMessage = responseProcedure[0][0];
            if(!responseMessage || responseMessage.respuesta !== "OK") {
                const message = responseMessage.respuesta ? responseMessage.respuesta : "Error al validar el préstamo."
                return res.status(503).json({message: message});
            }
            return res.status(200).json({message: responseMessage.respuesta });
        } else
            return res.status(503).json({message: "No se está enviando la compañía o el código del préstamo." });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function cambiarEstadoRemate(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        if( body.c_compania && body.c_prestamo && body.c_usuarioRemate, body.d_fechaRemate && body.c_observacionesremate ) {
            const conn = await connect();
            const [response, column] = await conn.query(`call sp_Cambiar_Remate(?, ?, ?, ?, ?, ?, @respuesta);`,[body.c_compania, body.c_prestamo, body.d_fechaRemate, body.c_observacionesremate, body.c_usuarioRemate, moment().format('YYYY-MM-DD HH:MM:ss')]);
            await conn.end();
            const responseProcedure = response as RowDataPacket;
            const responseMessage = responseProcedure[0][0];
            if(!responseMessage || responseMessage.respuesta !== "OK") {
                const message = responseMessage.respuesta ? responseMessage.respuesta : "Error al cambiar el estado del préstamo a remate."
                return res.status(503).json({message: message});
            }
            return res.status(200).json({message: responseMessage.respuesta });
        } else
            return res.status(503).json({message: "No se está enviando la compañía, el código del préstamo, el usuario que realiza el cambio de estado, la fecha de remate o la observación de remate." });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function updtVigentePrestamo(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        if(body.c_usuariovigente) {
            if(body.c_compania && body.c_prestamo && body.c_estado && body.c_observacionesvigente) {
                const conn = await connect();
                const [response, column] = await conn.query(`CALL sp_UpdVigente_Prestamo(?,?,?,?,?,@respuesta)`,[body.c_compania, body.c_prestamo,body.c_estado,body.c_observacionesvigente,body.c_usuariovigente]);
                await conn.end();
                const responseProcedure = response as RowDataPacket;
                const responseMessage = responseProcedure[0][0];
                if(!responseMessage || responseMessage.respuesta === "ERROR") {
                    return res.status(503).json({message: "Ocurrio un problema actualizar a vigente el préstamo" });
                } else {
                    return res.status(200).json({message: "Se egistró con éxito la operación del préstamo" });
                }
            }return res.status(503).json({ message: "Se debe enviar los datos obligatorios" });
        } return res.status(503).json({message: "No se está enviando el usuario que realiza el cambio de esrado." });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function cambiarEstadoEntregar(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        if( body.c_compania && body.c_prestamo && body.c_usuarioEntrega, body.d_fechaentrega && body.c_observacionesentrega ) {
            const conn = await connect();
            const [response, column] = await conn.query(`call prestaya.sp_Entregar_Prestamo(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @respuesta);`,
            [body.c_compania, body.c_prestamo, body.c_usuarioEntrega, body.d_fechaentrega, body.c_nombrepersonarecogio, body.c_tipodocumentopr, body.c_numerodocumentopr, body.c_telefonopr, body.c_observacionesentrega, moment().format('YYYY-MM-DD HH:MM:ss')]);
            await conn.end();
            const responseProcedure = response as RowDataPacket;
            const responseMessage = responseProcedure[0][0];
            if(!responseMessage || responseMessage.respuesta !== "OK") {
                const message = responseMessage.respuesta ? responseMessage.respuesta : "Error al cambiar el estado del préstamo a entregado."
                return res.status(503).json({message: message});
            }
            return res.status(200).json({message: responseMessage.respuesta });
        } else
            return res.status(503).json({message: "No se está enviando la compañía, el código del préstamo, el usuario que realiza el cambio de estado, la fecha de remate o la observación de remate." });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function getCancelacionesByCodigoPrestamo(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        if(body.c_compania && body.c_prestamo) {
            const conn = await connect();
            const [rows, fields] = await conn.query('SELECT * FROM co_prestamoscancelaciones where c_compania=? AND c_prestamo=?',[body.c_compania,body.c_prestamo])
            await conn.end();
            const prestamoRes = rows as [PrestamoCancelaciones];
            if(!prestamoRes[0]) {
                return res.status(200).json({ message: "No se encontró cancelaciones para ese préstamo" });
            }
            return res.status(200).json({ data:prestamoRes, message: "Se obtuvo registros" });
        }return res.status(200).json({ message: "Se debe enviar el código de compañía y código del préstamo para listar la información" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function cancelarPrestamo(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        if(body.c_ultimousuario) {
            if(body.c_compania && body.c_prestamo && body.n_montototalcancelar && body.c_tipocancelacion) {
                const conn = await connect();
                const [response, column] = await conn.query(`CALL sp_Agregar_Cancelacion(?,?,?,?,?,?,?,?,?,?,?,?,@respuesta)`,[body.c_compania,body.c_prestamo,body.n_linea,body.c_tipocancelacion,body.d_fechacancelacion,body.n_diastranscurridos,body.n_montointeresescancelar,body.n_montoprestamocancelar,body.n_montocomisioncancelar,body.n_montototalcancelar,body.c_observacionescancelar,body.c_ultimousuario]);
                await conn.end();
                const responseProcedure = response as RowDataPacket;
                const responseMessage = responseProcedure[0][0];
                if(!responseMessage || responseMessage.respuesta === "ERROR") {
                    return res.status(503).json({message: "Ocurrio un problema al registrar la cancelación del préstamo" });
                } else {
                    return res.status(200).json({message: "Se registró con éxito la cancelación" });
                }
            }return res.status(503).json({ message: "Se debe enviar los datos obligatorios" });
        } return res.status(503).json({message: "No se está enviando el usuario que realiza el registro." });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function anularCancelacion(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        if(body.c_compania && body.c_prestamo) {
            const conn = await connect();
            const [response, column] = await conn.query(`CALL sp_Anular_Cancelacion(?,?,@respuesta)`,[body.c_compania,body.c_prestamo]);
            await conn.end();
            const responseProcedure = response as RowDataPacket;
            const responseMessage = responseProcedure[0][0];
            if(!responseMessage || responseMessage.respuesta !== "OK") {
                const message = responseMessage.respuesta ? responseMessage.respuesta : "Error al anular la cancelación."
                return res.status(503).json({message: message});
            } else {
                return res.status(200).json({message: "Se anuló la cancelación con éxito." });
            }
        }return res.status(503).json({ message: "Se debe enviar los datos obligatorios" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function obtenerDatosFormatoPrestamo(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        if(body.c_compania && body.c_prestamo) {
            const conn = await connect();
            const [rows, fields] = await conn.query('SELECT p.*, a.c_descripcion as agencianame FROM co_prestamos p INNER JOIN ma_agencia a on a.c_agencia = p.c_agencia AND a.c_compania = p.c_compania WHERE p.c_compania=? AND p.c_prestamo=?;',
            [body.c_compania,body.c_prestamo])
            await conn.end();
            const prestamoRes =rows as [Prestamo];
            if(!prestamoRes[0]) {
                return res.status(200).json({ message: "No se encontró préstamos" });
            }
            return res.status(200).json({ data:prestamoRes[0], message: "Se obtuvo registros" });

        }return res.status(503).json({ message: "Se debe enviar los datos obligatorios" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}