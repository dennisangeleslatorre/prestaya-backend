import { Request, Response } from "express";
import { connect } from "../database";
import { RowDataPacket } from "mysql2";
import {
  FlujoCTiendaDia,
  FlujoCajaTiendaDiaMovimiento,
  FlujoCajaTiendaDiaMovimientoProcedure,
} from "../interfaces/flujoTienda.interface";
import moment from "moment";

export async function getFlujoCajaByCodigo(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const body = req.body;
    if (body.c_compania && body.n_correlativo) {
      const conn = await connect();
      const [responseFlujo, column2]: [any, any] = await conn.query(
        `CALL sp_Obtener_FlujoCajaTienda(?,?)`,
        [body.c_compania, body.n_correlativo]
      );
      await conn.end();
      const flujosCajaTienda = responseFlujo[0] as [any];
      if (flujosCajaTienda[0]) {
        let flujosDetallesTemporal: Array<FlujoCTiendaDia> = [];
        let flujosDetallesNuevo: Array<FlujoCTiendaDia> = [];
        flujosCajaTienda.forEach(
          (item: FlujoCajaTiendaDiaMovimientoProcedure) => {
            const fechaFormat = moment(item.d_fechamov).format("yyyy-MM-DD");
            let detalle = {
              general: {
                d_fechamov: fechaFormat,
                c_estado: item.c_estado,
                c_observaciones: item.c_observaciones_dia,
                c_usuarioregistro: item.c_usuarioregistro_dia,
                d_fecharegistro: item.d_fecharegistro_dia,
                c_ultimousuario: item.c_ultimousuario_dia,
                d_ultimafechamodificacion: item.d_ultimafechamodificacion_dia,
              },
            };
            if (item.n_secuencia) {
              let movimiento: FlujoCajaTiendaDiaMovimiento = {
                n_secuencia: item.n_secuencia,
                c_tipomovimientoctd: item.c_tipomovimientoctd,
                c_usuariomovimiento: item.c_usuariomovimiento,
                n_montoxdiamov: item.n_montoxdiamov,
                c_observaciones: item.c_observaciones_mov.replace(/['"]+/g, ""),
                c_usuarioregistro: item.c_usuarioregistro_mov,
                d_fecharegistro: item.d_fecharegistro_mov,
                c_ultimousuario: item.c_ultimousuario_mov,
                d_ultimafechamodificacion: item.d_ultimafechamodificacion_mov,
                c_flagtransaccion: item.c_flagtransaccion,
                c_tipodocumento: item.c_tipodocumento,
                c_numerodocumento: item.c_numerodocumento,
              };
              flujosDetallesTemporal = flujosDetallesNuevo.filter(
                (detalle: FlujoCTiendaDia) =>
                  detalle["general"]["d_fechamov"] === fechaFormat
              );
              if (flujosDetallesTemporal.length > 0) {
                let listmov = [
                  ...flujosDetallesNuevo[
                    flujosDetallesNuevo.indexOf(flujosDetallesTemporal[0])
                  ]["movimientos"],
                ];
                flujosDetallesNuevo[
                  flujosDetallesNuevo.indexOf(flujosDetallesTemporal[0])
                ]["movimientos"] = [...listmov, movimiento];
              } else {
                flujosDetallesNuevo.push({
                  ...detalle,
                  movimientos: [movimiento],
                });
              }
            } else {
              flujosDetallesNuevo.push({ ...detalle, movimientos: [] });
            }
          }
        );
        return res.status(200).json({
          data: {
            general: {
              c_compania: flujosCajaTienda[0].c_compania,
              n_correlativo: flujosCajaTienda[0].n_correlativo,
              c_agencia: flujosCajaTienda[0].c_agencia,
              c_tipofctienda: flujosCajaTienda[0].c_tipofctienda,
              c_usuariofctienda: flujosCajaTienda[0].c_usuariofctienda,
              d_fechainiciomov: moment(
                flujosCajaTienda[0].d_fechainiciomov
              ).format("yyyy-MM-DD"),
              d_fechafinmov: moment(flujosCajaTienda[0].d_fechafinmov).format(
                "yyyy-MM-DD"
              ),
              c_monedafctienda: flujosCajaTienda[0].c_monedafctienda,
              c_estado: flujosCajaTienda[0].c_estado,
              c_observaciones: flujosCajaTienda[0].c_observaciones,
              c_usuarioregistro: flujosCajaTienda[0].c_usuarioregistro,
              d_fecharegistro: flujosCajaTienda[0].d_fecharegistro,
              c_ultimousuario: flujosCajaTienda[0].c_ultimousuario,
              d_ultimafechamodificacion:
                flujosCajaTienda[0].d_ultimafechamodificacion,
            },
            detalles: flujosDetallesNuevo,
          },
          message: "Se obtuvo registros.",
        });
      }
      return res
        .status(503)
        .json({ data: [], message: "No se encontraron registros." });
    }
    return res
      .status(503)
      .json({ message: "Se debe enviar compañía y correlativo." });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}

export async function getFlujoCajaTiendaDinamico(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const body = req.body;
    body.c_compania = body.c_compania ? body.c_compania : null;
    body.c_agencia = body.c_agencia ? body.c_agencia : null;
    body.c_estado = body.c_estado ? body.c_estado : null;
    body.c_tipofctienda = body.c_tipofctienda ? body.c_tipofctienda : null;
    body.c_usuariofctienda = body.c_usuariofctienda
      ? body.c_usuariofctienda
      : null;
    body.c_usuarioregistro = body.c_usuarioregistro
      ? body.c_usuarioregistro
      : null;
    body.c_codigousuario = body.c_codigousuario ? body.c_codigousuario : null;
    if (body) {
      const conn = await connect();
      const [responseFlujo, column2]: [any, any] = await conn.query(
        `CALL prestaya.sp_ListarDinamico_FlujoTienda(?,?,?,?,?,?,?)`,
        [
          body.c_compania,
          body.c_agencia,
          body.c_estado,
          body.c_tipofctienda,
          body.c_usuariofctienda,
          body.c_usuarioregistro,
          body.c_codigousuario,
        ]
      );
      const flujosCajaTienda = responseFlujo[0] as [any];
      await conn.end();
      if (flujosCajaTienda[0]) {
        return res
          .status(200)
          .json({ data: flujosCajaTienda, message: "Se obtuvo registros." });
      }
      return res
        .status(200)
        .json({ data: [], message: "No se encontraron registros." });
    }
    return res
      .status(503)
      .json({ message: "Se debe enviar algún dato para filtrar." });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}

export async function getFlujoCajaTiendaDiaDinamico(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const body = req.body;
    if (body.c_compania && body.n_correlativo) {
      const conn = await connect();
      const [response, column2]: [any, any] = await conn.query(
        `CALL prestaya.sp_ListarDinamico_FlujoTiendaDia(?,?)`,
        [body.c_compania, body.n_correlativo]
      );
      const movimientosRes = response[0] as [any];
      await conn.end();
      if (movimientosRes[0]) {
        return res
          .status(200)
          .json({ data: movimientosRes, message: "Se obtuvo registros." });
      }
      return res
        .status(200)
        .json({ data: [], message: "No se encontraron registros." });
    }
    return res
      .status(503)
      .json({ message: "Se debe enviar compañía y correlativo." });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}

export async function getFlujoCajaTiendaDiaMovDinamico(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const body = req.body;
    if (body.c_compania && body.n_correlativo) {
      body.d_fechamovinicio = body.d_fechamovinicio
        ? body.d_fechamovinicio
        : null;
      body.d_fechamovfin = body.d_fechamovfin ? body.d_fechamovfin : null;
      const conn = await connect();
      const [response, column2]: [any, any] = await conn.query(
        `CALL prestaya.sp_ListarDinamico_FlujoTiendaDiaMov(?,?,?,?)`,
        [
          body.c_compania,
          body.n_correlativo,
          body.d_fechamovinicio,
          body.d_fechamovfin,
        ]
      );
      const movimientosRes = response[0] as [any];
      await conn.end();
      if (movimientosRes[0]) {
        return res
          .status(200)
          .json({ data: movimientosRes, message: "Se obtuvo registros." });
      }
      return res
        .status(200)
        .json({ data: [], message: "No se encontraron registros." });
    }
    return res
      .status(503)
      .json({ message: "Se debe enviar compañía y correlativo." });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}

export async function registerFlujoTienda(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const body = req.body;
    if (
      body.c_compania &&
      body.c_agencia &&
      body.c_tipofctienda &&
      body.c_usuariofctienda &&
      body.d_fechainiciomov &&
      body.d_fechafinmov &&
      body.c_monedafctienda &&
      body.c_estado &&
      body.c_observaciones &&
      body.c_usuarioregistro &&
      body.listdetalledia
    ) {
      const conn = await connect();
      const [response, column]: [any, any] = await conn.query(
        `CALL prestaya.sp_Registrar_FlujoTienda(?,?,?,?,?,?,?,?,?,?,?,@respuesta)`,
        [
          body.c_compania,
          body.c_agencia,
          body.c_tipofctienda,
          body.c_usuariofctienda,
          body.d_fechainiciomov,
          body.d_fechafinmov,
          body.c_monedafctienda,
          body.c_estado,
          body.c_observaciones,
          body.c_usuarioregistro,
          JSON.stringify(body.listdetalledia),
        ]
      );
      const messageValida = response as RowDataPacket;
      await conn.end();
      if (messageValida[0][0].respuesta === "OK") {
        return res
          .status(200)
          .json({ message: "Se registró con éxito el flujo de caja usuario." });
      }
      return res.status(503).json({ message: "Campos incompletos." });
    }
    return res
      .status(503)
      .json({ message: "Se debe enviar compañía, los campos obligatorios." });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}

export async function updateFlujoTienda(req: Request, res: Response): Promise<Response> {
  try {
      const body = req.body;
      const nuevosDetalles = req.body.nuevosDetalles ? req.body.nuevosDetalles : null;
      const actualizarDetalles = req.body.actualizarDetalles ? req.body.actualizarDetalles : null;
      const eliminarDetalles = req.body.eliminarDetalles ? req.body.eliminarDetalles : null;
      const eliminarMovimientos = req.body.eliminarMovimientos ? req.body.eliminarMovimientos : null;
      if (body.c_compania && body.c_agencia && body.c_tipofctienda && body.c_usuariofctienda && body.d_fechaInicioMov && body.n_correlativo
          && body.d_fechaFinMov && body.c_monedafctienda && body.c_estado && body.c_observaciones && body.c_ultimousuario) 
          {
          const conn = await connect();

          const [responseValida, column] = await conn.query(`CALL sp_Valida_Datos_FT_Actualizar('${body.c_compania}','${body.n_correlativo}','${body.c_agencia}','${body.c_usuariofctienda}','${body.d_fechaInicioMov}','${body.d_fechaFinMov}',@respuesta)`)
          const messageValida = responseValida as RowDataPacket;
          if(messageValida[0][0].respuesta === "OK") {

              const [responseFlujo, column2] = await conn.query(`CALL sp_actualizar_flujoctienda('${body.c_compania}','${body.n_correlativo}','${body.c_agencia}','${body.c_tipofctienda}','${body.c_usuariofctienda}','${body.d_fechaInicioMov}','${body.d_fechaFinMov}','${body.c_monedafctienda}','${body.c_estado}','${body.c_observaciones}','${body.c_ultimousuario}',@respuesta)`)
              const responseProcedure = responseFlujo as RowDataPacket;
              const responseMessage = responseProcedure[0][0];

              if(!responseMessage || responseMessage.respuesta === "ERROR") {
                  await conn.end();
                  return res.status(503).json({message: "Campos incompletos." });
              } else {
                  if(eliminarMovimientos) {
                      await conn.query(
                      `CALL sp_eliminar_movimientostienda('${body.c_compania}','${body.n_correlativo}',"${eliminarMovimientos}",@respuesta)`
                      )
                  }
                  if(eliminarDetalles) {
                      console.log("eliminarDetalles", eliminarDetalles);
                      await conn.query(
                      `CALL sp_eliminar_flujodiastienda('${body.c_compania}','${body.n_correlativo}',"${eliminarDetalles}",@respuesta)`
                      )
                  }
                  if(actualizarDetalles) {
                      await conn.query(
                      `CALL sp_actualizar_flujoctiendadia('${body.c_compania}','${body.n_correlativo}','${body.c_ultimousuario}',"${actualizarDetalles}",@respuesta)`
                      )
                  }
                  if(nuevosDetalles) {
                      await conn.query(
                      `CALL sp_Nuevos_Dias_FlujoTienda('${body.c_compania}','${body.n_correlativo}','${body.c_ultimousuario}',"${nuevosDetalles}",@respuesta)`
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