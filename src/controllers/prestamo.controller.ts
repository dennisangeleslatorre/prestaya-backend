import { Request, response, Response } from 'express'
import { Prestamo } from 'interfaces/prestamo.inteface';
import { Result } from "../interfaces/result"
import { connect } from '../database'

export async function validateTipos(req: Request, res: Response): Promise<Response> {
    try {
        const ids = req.body.ids;
        const conn = await connect();
        const [response, column] = await conn.query(`call sp_Validar_EstadoProducto("${ids}",@respuesta)`);
        await conn.end();
        const responseMessage = response[0][0];
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
        const responseMessage = response[0][0];
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

export async function insertProductoGarantia(c_compania:string, c_prestamo:string, c_usuarioregistro:string, productos:string): Promise<Result> {
    try {
        const conn = await connect();
        const [responseProducts, column2] = await conn.query(`CALL sp_Registrar_Producto('${c_compania}','${c_prestamo}','${c_usuarioregistro}','${c_usuarioregistro}','${productos}',@respuesta)`)
        await conn.end();
        const responseMessage = responseProducts[0][0];
        if(!responseMessage || responseMessage.respuesta === "ERROR") {
            return Promise.reject({ success: false, message:"No se pudo crear los productos" });
        }
        return Promise.resolve({ success: true, data: responseMessage.respuesta });
    } catch (error) {
        console.error(error);
        return Promise.reject({ success: false, error });
    }
}

export async function deletePrestamo(c_prestamo:string): Promise<Result> {
    try {
        const conn = await connect();
        await conn.query('DELETE FROM co_prestamosproductos WHERE c_prestamo = ?', [c_prestamo]);
        await conn.end();
        return Promise.resolve({ success: true, data: "Se eliminó con éxito." });
    } catch (error) {
        console.error(error);
        return Promise.reject({ success: false, error });
    }
}

export async function registerPrestamo(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body.prestamo;
        const productos = req.body.productos;
        if(body.c_usuarioregistro) {
            body.c_ultimousuario = body.c_usuarioregistro;
            body.c_usuarioregpendiente = body.c_usuarioregistro;
            if(body.c_compania && body.n_cliente && body.c_paiscodigo && body.c_departamentocodigo && body.c_provinciacodigo && body.c_distritocodigo) {
                const conn = await connect();
                const [response, column] = await conn.query(`CALL sp_Registrar_Prestamo('${body.c_compania}','${body.n_cliente}','${body.c_nombrecompleto}','${body.c_tipodocumento}','${body.c_numerodocumento}','${body.c_direccioncliente}','${body.c_paiscodigo}','${body.c_departamentocodigo}','${body.c_provinciacodigo}','${body.c_distritocodigo}','${body.c_telefono1}','${body.c_monedaprestamo}','${body.n_montoprestamo}','${body.n_tasainteres}','${body.n_montointereses}','${body.n_montototalprestamo}','${body.d_fechadesembolso}','${body.n_diasplazo}','${body.d_fechavencimiento}','${body.n_montointeresesdiario}','${body.c_observacionesregistro}','${body.c_usuarioregistro}','${body.c_ultimousuario}','${body.c_usuarioregpendiente}',@respuesta)`);
                await conn.end();
                const responseMessage = response[0][0];
                if(!responseMessage || responseMessage.respuesta === "ERROR") {
                    return res.status(503).json({message: "Ocurrio un problema al insertar el préstamo" });
                } else {
                    if(productos) {
                        console.log("responseMessage.respuesta", responseMessage.respuesta)
                        const responseProducts = await insertProductoGarantia(body.c_compania, responseMessage.respuesta, body.c_usuarioregistro, productos);
                        if(responseProducts.success) {
                            return res.status(200).json({message: "Se egistró con éxito el préstamo" });
                        } else {
                            await deletePrestamo( responseMessage.respuesta);
                            return res.status(503).json({message: "Ocurrió un problema al insertar el préstamo" });
                        }
                    }
                    return res.status(200).json({message: "Se egistró con éxito el préstamo" });
                }
            }return res.status(503).json({ message: "Se debe enviar los datos obligatorios" });
        } return res.status(503).json({message: "No se está enviando el usuario que realiza el registro." });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function getPrestamoDinamico(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        body.c_compania			  		 = body.c_compania				   ? body.c_compania			  	: null
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

        if(body) {
            const conn = await connect();
            const [[rows,fields], response] = await conn.query(`CALL sp_listDinamico_Prestamo(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,[body.c_compania, body.c_prestamo,body.n_cliente,body.c_nombrescompleto,body.c_tipodocumento,body.c_numerodocumento,body.c_paiscodigo,body.c_departamentocodigo,body.c_provinciacodigo,body.c_distritocodigo,body.c_telefono1,body.d_fechadesembolsoinicio,body.d_fechadesembolsofin,body.d_fechavencimientoinicio,body.d_fechavencimientofin,body.d_fecharegistroinicio,body.d_fecharegistrofin,body.d_fechavigenteinicio,body.d_fechavigentefin,body.d_fechaentregainicio,body.d_fechaentregafin,body.d_fechaEntregaUSinicio,body.d_fechaEntregaUSfin,body.d_fechaanulacioninicio,body.d_fechaanulacionfin,body.d_fechaRemateinicio,body.d_fechaRematefin,body.d_fechaRemateUSinicio,body.d_fechaRemateUSfin,body.d_fecharegpendienteinicio,body.d_fecharegpendientefin,body.d_fechacancelacioninicio,body.d_fechacancelacionfin]);
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