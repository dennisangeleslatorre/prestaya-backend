import { Request, Response } from 'express'
import { connect } from '../database'
import { Reporte } from 'interfaces/reporte.interface'
import { Prestamo } from 'interfaces/prestamo.inteface';
import { PerfilReporte } from 'interfaces/perfilReporte.interface';
import { Result } from 'interfaces/result';
import moment from 'moment'

export async function getReportes(req: Request, res: Response): Promise<Response> {
    try {
        const conn = await connect();
        const [rows, fields] = await conn.query("SELECT * FROM prestaya.ma_reportes WHERE c_estado='A'");
        await conn.end();
        const reporteRes = rows as [Reporte];
        if(!reporteRes[0]) {
            return res.status(200).json({data:[], message: "No se encontró reportes asignados al perfil" });
        }
        return res.status(200).json({data:rows, message: "Se obtuvo registros" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function getReportesByPerfil(req: Request, res: Response): Promise<Response> {
    try {
        const n_perfil = req.body.n_perfil;
        const conn = await connect();
        const [rows, fields] = await conn.query("SELECT r.*, p.c_acceso FROM ma_reportes r INNER JOIN ma_perfilreporte p ON r.c_tiporeporte = p.c_tiporeporte AND r.n_grupo = p.n_grupo AND r.n_reporte = p.n_reporte WHERE p.c_acceso = 'S' AND p.n_perfil = ?;",[n_perfil]);
        await conn.end();
        const reporteRes = rows as [Reporte];
        if(!reporteRes[0]) {
            return res.status(200).json({data:[], message: "No se encontró reportes asignados al perfil" });
        }
        return res.status(200).json({data:rows, message: "Se obtuvo registros" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function functionGetDataReporteResumidoPrestamo(c_compania: string, periodo_inicio: string, periodo_fin: string, n_cliente: string): Promise<Result> {
    try {
        let queryWhere = `WHERE p.c_compania = ${c_compania} AND p.c_estado IN ('VI', 'CA', 'EN', 'RE')`;
        if(periodo_inicio && periodo_fin) queryWhere = `${queryWhere} AND ( DATE_FORMAT(p.d_fechadesembolso, '%Y%m') BETWEEN ${periodo_inicio} AND ${periodo_fin} )`
        if(n_cliente) queryWhere = `${queryWhere} AND p.n_cliente = ${n_cliente}`
        const conn = await connect();
        const [rows, fields] = await conn.query(`
            SELECT DATE_FORMAT(p.d_fechadesembolso, '%Y%m')  as periodo, p.n_cliente as cliente, p.c_nombrescompleto  as clientenombre, p.c_monedaprestamo  as moneda, p.d_fechadesembolso,
            SUM(p.n_montoprestamo) as calc_sumamontoprestamo, SUM(p.n_montointereses) as calc_sumamontointereses,
            SUM(p.n_montototalprestamo) as calc_sumamontototalprestamo, SUM(pp.n_montovalortotal) as calc_sumamontovalorproductos FROM co_prestamos p
            INNER JOIN co_prestamosproductos pp ON p.c_compania = pp.c_compania AND p.c_prestamo = pp.c_prestamo
            ${queryWhere}
            GROUP BY periodo, p.n_cliente, p.c_nombrescompleto, p.c_monedaprestamo, p.d_fechadesembolso;
        `);
        await conn.end();
        const reportePrestamoRes = rows as [Prestamo];
        if(!reportePrestamoRes[0]) {
            return Promise.resolve({ success: false, data: {} });
        }
        return Promise.resolve({ success: true, data: reportePrestamoRes });
    } catch (error) {
        console.error(error);
        return Promise.reject({ success: false, error });
    }
}

export async function functionGetDataReporteResumidoCancelaciones(c_compania: string, periodo_inicio: string, periodo_fin: string, n_cliente: string): Promise<Result> {
    try {
        let queryWhere = `WHERE p.c_compania = ${c_compania}`;
        if(periodo_inicio && periodo_fin) queryWhere = `${queryWhere} AND ( DATE_FORMAT(pc.d_fechacancelacion, '%Y%m') BETWEEN ${periodo_inicio} AND ${periodo_fin} )`
        else queryWhere = `${queryWhere} AND DATE_FORMAT(pc.d_fechacancelacion, '%Y%m') IS NOT NULL`
        if(n_cliente) queryWhere = `${queryWhere} AND p.n_cliente = ${n_cliente}`
        const conn = await connect();
        const [rows, fields] = await conn.query(`
            SELECT DATE_FORMAT(pc.d_fechacancelacion, '%Y%m')  as periodo, p.n_cliente as cliente, p.c_nombrescompleto as clientenombre, p.c_monedaprestamo as moneda, pc.d_fechacancelacion,
            SUM(pc.n_montointeresescancelar) as calc_sumainterecamcelado, SUM(pc.n_montoprestamocancelar) as calc_montoprestamocancelado, SUM(pc.n_montocomisioncancelar) as calc_sumacomisioncancelada,
            SUM(pc.n_montototalcancelar) as calc_sumamontototalcancelado FROM co_prestamos p
            INNER JOIN co_prestamoscancelaciones pc ON p.c_compania = pc.c_compania AND p.c_prestamo = pc.c_prestamo
            ${queryWhere}
            GROUP BY periodo, p.n_cliente, p.c_nombrescompleto, p.c_monedaprestamo, pc.d_fechacancelacion;
        `);
        await conn.end();
        const reporteCancelacionRes = rows as [Prestamo];
        if(!reporteCancelacionRes[0]) {
            return Promise.resolve({ success: false, data: {} });
        }
        return Promise.resolve({ success: true, data: reporteCancelacionRes });
    } catch (error) {
        console.error(error);
        return Promise.reject({ success: false, error });
    }
}

export async function getDataReporteResumidos(req: Request, res: Response): Promise<Response> {
    try {
        const c_compania = req.body.c_compania;
        const periodo_inicio = req.body.periodo_inicio;
        const periodo_fin = req.body.periodo_fin;
        const n_cliente = req.body.n_cliente;
        const responseDataPrestamos = await functionGetDataReporteResumidoPrestamo(c_compania, periodo_inicio, periodo_fin, n_cliente);
        const dataPrestamos = responseDataPrestamos.success ? responseDataPrestamos.data as [Object] : [];
        const responseDataCancelaciones = await functionGetDataReporteResumidoCancelaciones(c_compania, periodo_inicio, periodo_fin, n_cliente);
        const dataCancelaciones = responseDataCancelaciones.success ? responseDataCancelaciones.data as [Object] : [];
        return res.status(200).json({data:[...dataPrestamos, ...dataCancelaciones]});
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function functionGetDataReporteDetallado(c_compania: string, c_prestamo: string, n_cliente: string, esvencido: string, c_paiscodigo: string, c_departamentocodigo: string,
    c_provinciacodigo: string, c_distritocodigo: string, c_estado: string, excluiranulados: boolean, solovalidos: boolean, d_fechadesembolsoinicio: string, d_fechadesembolsofin: string,
    d_fechacancelacioninicio: string, d_fechacancelacionfin: string, d_fechavencimientoinicio: string, d_fechavencimientofin: string, d_fechavencimientoreprogramadainicio: string,
    d_fechavencimientoreprogramadafin: string): Promise<Result> {
    try {
        let queryWherePrestamo = `WHERE p.c_compania = '${c_compania}'`;
        let queryWhereCancelacion = `WHERE c.c_compania = '${c_compania}'`;
        let queryWhereJoin = `WHERE pres.c_compania = '${c_compania}'`;
        //Filtros de prestamo
        if(c_prestamo) queryWherePrestamo = `${queryWherePrestamo} AND p.c_prestamo = ${c_prestamo}`;
        if(n_cliente) queryWherePrestamo = `${queryWherePrestamo} AND p.n_cliente = ${n_cliente}`;
        if(c_paiscodigo) queryWherePrestamo = `${queryWherePrestamo} AND p.c_paiscodigo = ${c_paiscodigo}`;
        if(c_departamentocodigo) queryWherePrestamo = `${queryWherePrestamo} AND p.c_departamentocodigo = ${c_departamentocodigo}`;
        if(c_provinciacodigo) queryWherePrestamo = `${queryWherePrestamo} AND p.c_provinciacodigo = ${c_provinciacodigo}`;
        if(c_distritocodigo) queryWherePrestamo = `${queryWherePrestamo} AND p.c_distritocodigo = ${c_distritocodigo}`;
        if(c_estado) {queryWherePrestamo = `${queryWherePrestamo} AND p.c_estado = '${c_estado}'`}
        else {
            if(solovalidos) queryWherePrestamo = `${queryWherePrestamo} AND p.c_estado IN ('VI', 'CA', 'EN', 'RE')`;
            else if(excluiranulados) queryWherePrestamo = `${queryWherePrestamo} AND p.c_estado IN ('PE', 'VI', 'CA', 'EN', 'RE')`;
        }
        if(d_fechadesembolsoinicio && d_fechadesembolsofin) queryWherePrestamo = `${queryWherePrestamo} AND (p.d_fechadesembolso BETWEEN '${d_fechadesembolsoinicio}' AND '${d_fechadesembolsofin}')`;
        if(d_fechavencimientoinicio && d_fechavencimientofin) queryWherePrestamo = `${queryWherePrestamo} AND (p.d_fechavencimiento BETWEEN '${d_fechavencimientoinicio}' AND '${d_fechavencimientofin}')`;
        //Filtros Join
        if(esvencido) queryWhereJoin = `${queryWhereJoin} AND can.esvencido = ${esvencido}`;
        if(d_fechacancelacioninicio && d_fechacancelacionfin) queryWhereJoin = `${queryWhereJoin} AND (can.ultimafechacancelacionregistrada BETWEEN '${d_fechacancelacioninicio}' AND '${d_fechacancelacionfin}')`;
        if(d_fechavencimientoreprogramadainicio && d_fechavencimientoreprogramadafin) queryWhereJoin = `${queryWhereJoin} AND (can.d_fechavencimientoreprogramada BETWEEN '${d_fechavencimientoreprogramadainicio}' AND '${d_fechavencimientoreprogramadafin}')`;

        const conn = await connect();
        const [rows, fields] = await conn.query(`
            SELECT pres.c_prestamo, pres.c_compania, pres.n_cliente, pres.c_nombrescompleto, pres.d_fechadesembolso, pres.n_diasplazo * can.ultimalinea as calc_diasplazototales, pres.d_fechavencimiento, pres.c_monedaprestamo,
            pres.n_montoprestamo, pres.n_tasainteres, pres.n_montointereses, pres.n_montototalprestamo, pres.calc_sumamontovalorproductos, pres.c_estado, pres.c_descripcion as nombredistrito,
            can.d_fechavencimientoreprogramada, can.ultimafechacancelacionregistrada, can.calc_sumainterescancelado, can.calc_sumamontoprestamocancelado,
            can.calc_sumamontocomisioncancelada, can.calc_sumamontotalcancelado, can.ultimalinea, can.calc_diasvencido, can.esvencido, pres.n_diasplazo
            FROM (
            SELECT p.c_prestamo, p.c_compania, p.n_cliente, p.c_nombrescompleto, p.d_fechadesembolso, p.n_diasplazo, p.d_fechavencimiento, p.c_monedaprestamo, p.n_montoprestamo, p.n_tasainteres,
            p.n_montointereses, p.n_montototalprestamo, SUM(pp.n_montovalortotal) as calc_sumamontovalorproductos, p.c_estado, d.c_descripcion
            FROM co_prestamos p
            LEFT JOIN co_prestamosproductos pp ON pp.c_prestamo = p.c_prestamo AND p.c_compania = pp.c_compania
            INNER JOIN ma_distrito d ON d.c_paiscodigo = p.c_paiscodigo AND d.c_departamentocodigo = p.c_departamentocodigo AND d.c_provinciacodigo = p.c_provinciacodigo AND d.c_distritocodigo = p.c_distritocodigo
            ${queryWherePrestamo}
            GROUP BY p.c_prestamo, p.c_compania) pres
            LEFT JOIN
            (SELECT  cc.c_prestamo, cc.c_compania, cc.d_fechavencimientoreprogramada, cc.ultimafechacancelacionregistrada, cc.calc_sumainterescancelado, cc.calc_sumamontoprestamocancelado,
            cc.calc_sumamontocomisioncancelada, cc.calc_sumamontotalcancelado, cv.ultimalinea, cv.calc_diasvencido, cv.esvencido
            FROM (SELECT ca.c_prestamo, ca.c_compania, ca.d_fechavencimientoreprogramada, ca.ultimafechacancelacionregistrada, SUM(cb.n_montointeresescancelar) as calc_sumainterescancelado,
            SUM(cb.n_montoprestamocancelar) as calc_sumamontoprestamocancelado, SUM(cb.n_montocomisioncancelar) as calc_sumamontocomisioncancelada,
            SUM(cb.n_montototalcancelar) as calc_sumamontotalcancelado
            FROM (SELECT c.c_prestamo, c.c_compania, MAX(c.d_fechavencimiento) as d_fechavencimientoreprogramada, MAX(c.d_fechacancelacion) as ultimafechacancelacionregistrada
            FROM co_prestamoscancelaciones c
            ${queryWhereCancelacion}
            GROUP BY c.c_prestamo, c.c_compania) ca
            INNER JOIN co_prestamoscancelaciones cb ON ca.c_prestamo = cb.c_prestamo AND cb.c_compania = ca.c_compania
            GROUP BY cb.c_prestamo, cb.c_compania) cc
            INNER JOIN
            (SELECT  ca.c_prestamo, ca.c_compania, ca.ultimalinea,
            if(cb.d_fechacancelacion IS NULL, DATEDIFF(now(), cb.d_fechavencimiento), DATEDIFF(cb.d_fechacancelacion, cb.d_fechavencimiento)) as calc_diasvencido,
            if((if(cb.d_fechacancelacion IS NULL, DATEDIFF(now(), cb.d_fechavencimiento), DATEDIFF(cb.d_fechacancelacion, cb.d_fechavencimiento))) > 0, 'S', 'N') as esvencido
            FROM ( SELECT c.c_prestamo, c.c_compania, MAX(c.n_linea) as ultimalinea
            FROM co_prestamoscancelaciones c
            ${queryWhereCancelacion}
            GROUP BY c.c_prestamo, c.c_compania) ca
            INNER JOIN co_prestamoscancelaciones cb ON ca.c_prestamo = cb.c_prestamo AND cb.c_compania = ca.c_compania AND ca.ultimalinea = cb.n_linea
            GROUP BY cb.c_prestamo, cb.c_compania) cv
            ON cc.c_prestamo = cv.c_prestamo AND cc.c_compania = cv.c_compania) can
            ON pres.c_prestamo = can.c_prestamo AND pres.c_compania = can.c_compania
            ${queryWhereJoin}
        `);
        await conn.end();
        const reporteCancelacionRes = rows as [Prestamo];
        if(!reporteCancelacionRes[0]) {
            return Promise.resolve({ success: false, data: {} });
        }
        return Promise.resolve({ success: true, data: reporteCancelacionRes });
    } catch (error) {
        console.error(error);
        return Promise.reject({ success: false, error });
    }
}

export async function getDataReporteDetallado(req: Request, res: Response): Promise<Response> {
    try {
        //strings
        const c_compania = req.body.c_compania;
        const n_cliente = req.body.n_cliente;
        const esvencido = req.body.esvencido;
        const c_paiscodigo = req.body.c_paiscodigo;
        const c_departamentocodigo = req.body.c_departamentocodigo;
        const c_provinciacodigo = req.body.c_provinciacodigo;
        const c_distritocodigo = req.body.c_distritocodigo;
        const c_estado = req.body.c_estado;
        const c_prestamo = req.body.c_prestamo;
        //booleans
        const excluiranulados = req.body.excluiranulados;
        const solovalidos = req.body.solovalidos;
        //Fechas
        const d_fechadesembolsoinicio = req.body.d_fechadesembolsoinicio;
        const d_fechadesembolsofin = req.body.d_fechadesembolsofin;
        const d_fechacancelacioninicio = req.body.d_fechacancelacioninicio;
        const d_fechacancelacionfin = req.body.d_fechacancelacionfin;
        const d_fechavencimientoinicio = req.body.d_fechavencimientoinicio;
        const d_fechavencimientofin = req.body.d_fechavencimientofin;
        const d_fechavencimientoreprogramadainicio = req.body.d_fechavencimientoreprogramadainicio;
        const d_fechavencimientoreprogramadafin = req.body.d_fechavencimientoreprogramadafin;
        const responseDataReporteDetallado = await functionGetDataReporteDetallado(c_compania, c_prestamo, n_cliente, esvencido, c_paiscodigo, c_departamentocodigo, c_provinciacodigo, c_distritocodigo,
            c_estado, excluiranulados, solovalidos, d_fechadesembolsoinicio, d_fechadesembolsofin, d_fechacancelacioninicio, d_fechacancelacionfin, d_fechavencimientoinicio, d_fechavencimientofin,
            d_fechavencimientoreprogramadainicio, d_fechavencimientoreprogramadafin);

        const dataReporteDetallado = responseDataReporteDetallado.success ? responseDataReporteDetallado.data as [Object] : [];

        return res.status(200).json({data:dataReporteDetallado});
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function getReporteAcceso(n_perfil:string, c_tiporeporte:string, n_grupo:number, n_reporte:number): Promise<Result> {
    try {
        const conn = await connect();
        const res = await conn.query('SELECT * FROM ma_perfilreporte WHERE n_perfil = ? AND c_tiporeporte = ? AND n_grupo = ? AND n_reporte = ?', [n_perfil, c_tiporeporte, n_grupo, n_reporte]);
        await conn.end();
        return Promise.resolve({ success: true, data: res[0] });
    } catch (error) {
        console.error(error);
        return Promise.reject({ success: false, error });
    }
}

export async function updateReporteAcceso(n_perfil:string, c_tiporeporte:string, n_grupo:number, n_reporte:number, c_ultimousuario: String): Promise<Result> {
    try {
        const conn = await connect();
        const res = await conn.query("UPDATE ma_perfilreporte set c_acceso='S', c_ultimousuario = ?, d_ultimafechamodificacion = ? WHERE n_perfil = ? AND c_tiporeporte = ? AND n_grupo = ? AND n_reporte = ?",
        [c_ultimousuario, moment().format('YYYY-MM-DD HH:MM:ss'), n_perfil, c_tiporeporte, n_grupo, n_reporte]);
        await conn.end();
        return Promise.resolve({ success: true, data: res[0] });
    } catch (error) {
        console.error(error);
        return Promise.reject({ success: false, error });
    }
}

export async function createReporteAcceso(n_perfil:string, c_tiporeporte:string, n_grupo:number, n_reporte:number, usuario:string): Promise<Result> {
    try {
        const reporteAcceso: PerfilReporte = {
            n_perfil: n_perfil,
            c_tiporeporte: c_tiporeporte,
            n_grupo: n_grupo,
            n_reporte: n_reporte,
            c_acceso: 'S',
            c_estado: 'A',
            c_ultimousuario: usuario,
            d_ultimafechamodificacion: moment().format('YYYY-MM-DD HH:MM:ss')
        };
        const conn = await connect();
        const res = await conn.query("INSERT INTO ma_perfilreporte SET ?",
        [reporteAcceso]);
        await conn.end();
        return Promise.resolve({ success: true, data: res[0] });
    } catch (error) {
        console.error(error);
        return Promise.reject({ success: false, error });
    }
}

export async function restablecerAccessos(n_perfil:string, c_ultimousuario: string): Promise<Result> {
    try {
        const conn = await connect();
        const res = await conn.query("UPDATE ma_perfilreporte set c_acceso='N', c_ultimousuario = ?, d_ultimafechamodificacion = ? WHERE n_perfil = ?",
        [c_ultimousuario, moment().format('YYYY-MM-DD HH:MM:ss'), n_perfil]);
        await conn.end();
        return Promise.resolve({ success: true, data: res[0] });
    } catch (error) {
        console.error(error);
        return Promise.reject({ success: false, error });
    }
}

export async function assignReportToProfile(req: Request, res: Response): Promise<Response> {
    try {
        const reportes = req.body.reportes;
        const usuario = req.body.usuario;
        const n_perfil = req.body.n_perfil;
        await restablecerAccessos(n_perfil, usuario);
        if(reportes.length > 0) {
            reportes.forEach( async (reporte: PerfilReporte) => {
                //Buscamos si existe
                const reporteRes = await getReporteAcceso(n_perfil, reporte.c_tiporeporte, reporte.n_grupo, reporte.n_reporte);
                const reporteData = reporteRes.data as [PerfilReporte];
                //si esxite lo actualizas si no lo creas
                if(reporteData.length > 0) {
                    await updateReporteAcceso(n_perfil, reporte.c_tiporeporte, reporte.n_grupo, reporte.n_reporte, usuario);
                } else {
                    await createReporteAcceso(n_perfil, reporte.c_tiporeporte, reporte.n_grupo, reporte.n_reporte, usuario);
                }
            });
        }
        return res.status(200).send({success: true})
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function getDataReporteFlujoCaja(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        body.c_compania	= body.c_compania ? body.c_compania : null;
        body.c_agencia = body.c_agencia ? body.c_agencia : null;
        body.c_monedafcu = body.c_monedafcu ? body.c_monedafcu : null;
        body.c_tipofcu = body.c_tipofcu ? body.c_tipofcu : null;
        body.c_usuariofcu = body.c_usuariofcu ? body.c_usuariofcu : null;
        body.d_fechamovimientoinicio = body.d_fechamovimientoinicio ? body.d_fechamovimientoinicio : null;
        body.d_fechamovimientofin = body.d_fechamovimientofin ? body.d_fechamovimientofin : null;
        body.c_estado = body.c_estado ? body.c_estado : null;
        body.c_fuente = body.c_fuente ? body.c_fuente : null;
        body.c_tipomovimientocc = body.c_tipomovimientocc ? body.c_tipomovimientocc : null;
        body.c_clasetipomov = body.c_clasetipomov ? body.c_clasetipomov : null;

        if(body.c_compania) {
            let movimientosCajaUsuario = [];
            let movimientosPrestamos:any = [];
            let movimientosCancelaciones:any = [];
            const conn = await connect();

            const [responseFlujo, column2] : [any, any] = await conn.query(`CALL sp_Reporte_FLujoCaja_Movimientos(?,?,?,?,?,?,?,?,?,?,?)`,
            [   body.c_compania, body.c_agencia, body.c_monedafcu, body.c_tipofcu, body.c_usuariofcu, body.d_fechamovimientoinicio, body.d_fechamovimientofin,
                body.c_estado, body.c_fuente, body.c_tipomovimientocc, body.c_clasetipomov
            ]);
            movimientosCajaUsuario = responseFlujo[0] as [any];
            //console.log(movimientosCajaUsuario)

            if(body.c_clasetipomov != "S" || body.c_tipomovimientocc != "003" ) {
                const [responseMovPrestamos, columnMP] : [any, any] = await conn.query(`CALL sp_Reporte_Prestamos_Movimientos(?,?,?,?,?,?)`,
                [body.c_compania, body.c_agencia, body.c_monedafcu, body.d_fechamovimientoinicio, body.d_fechamovimientofin, body.c_usuariofcu]);
                movimientosPrestamos = responseMovPrestamos[0] as [any];
            }

            if(body.c_clasetipomov != "I" || (body.c_tipomovimientocc != "004" || body.c_tipomovimientocc != "005" || body.c_tipomovimientocc != "006") ) {
                const [responseMovCancelaciones, columnMC] : [any, any] = await conn.query(`CALL sp_Reporte_Cancelaciones_Movimientos(?,?,?,?,?,?,?)`,
                [body.c_compania, body.c_agencia, body.c_monedafcu, body.d_fechamovimientoinicio, body.d_fechamovimientofin, body.c_tipomovimientocc, body.c_usuariofcu]);
                movimientosCancelaciones = responseMovCancelaciones[0] as [any];
            }

            await conn.end();
            return res.status(200).json({data:{
                movimientosCajaUsuario: movimientosCajaUsuario,
                movimientosPxC: [...movimientosPrestamos, ...movimientosCancelaciones]
            }, message: "Se obtuvieron registros." });
        }
        return res.status(503).json({ message: "Se debe enviar la compañía para filtrar." });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error);
    }
}

export async function getDataReporteVencidosyNoVencidos(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        if(body.c_compania && body.d_fechaactual) {
            //Where
            let queryWherePrestamo = `WHERE p.c_compania = '${body.c_compania}'`;
            let queryWhereCancelacion = `WHERE c.c_compania = '${body.c_compania}'`;
            let queryWhereJoin = `WHERE pres.c_compania = '${body.c_compania}'`;
            //Prestamos
            if(body.c_agencia) queryWherePrestamo = `${queryWherePrestamo} AND p.c_agencia = '${body.c_agencia}'`;
            if(body.n_cliente) queryWherePrestamo = `${queryWherePrestamo} AND p.n_cliente = '${body.n_cliente}'`;
            if(body.c_estado) {queryWherePrestamo = `${queryWherePrestamo} AND p.c_estado = '${body.c_estado}'`}
            else {
                queryWherePrestamo = `${queryWherePrestamo} AND p.c_estado IN ('VI', 'CA', 'EN', 'RE')`;
            }
            if(body.d_fechadesembolsoinicio && body.d_fechadesembolsofin) queryWherePrestamo = `${queryWherePrestamo} AND (p.d_fechadesembolso BETWEEN '${body.d_fechadesembolsoinicio}' AND '${body.d_fechadesembolsofin}')`;
            if(body.d_fechavencimientoinicio && body.d_fechavencimientofin) queryWherePrestamo = `${queryWherePrestamo} AND (p.d_fechavencimiento BETWEEN '${body.d_fechavencimientoinicio}' AND '${body.d_fechavencimientofin}')`;
            if(body.c_prestamo) queryWherePrestamo = `${queryWherePrestamo} AND p.c_prestamo = '${body.c_prestamo}'`;
            if(body.c_paiscodigo) queryWherePrestamo = `${queryWherePrestamo} AND p.c_paiscodigo = '${body.c_paiscodigo}'`;
            if(body.c_departamentocodigo) queryWherePrestamo = `${queryWherePrestamo} AND p.c_departamentocodigo = '${body.c_departamentocodigo}'`;
            if(body.c_provinciacodigo) queryWherePrestamo = `${queryWherePrestamo} AND p.c_provinciacodigo = '${body.c_provinciacodigo}'`;
            if(body.c_distritocodigo) queryWherePrestamo = `${queryWherePrestamo} AND p.c_distritocodigo = '${body.c_distritocodigo}'`;
            //Filtros Join
            if(body.d_fechacancelacioninicio && body.d_fechacancelacionfin) queryWhereJoin = `${queryWhereJoin} AND (can.ultimafechacancelacionregistrada BETWEEN '${body.d_fechacancelacioninicio}' AND '${body.d_fechacancelacionfin}')`;
            if(body.esVencido) queryWhereJoin = `${queryWhereJoin} AND can.esvencido = '${body.esVencido}'`;
            if(body.d_fechavencimientoreprogramadainicio && body.d_fechavencimientoreprogramadafin) queryWhereJoin = `${queryWhereJoin} AND (can.d_fechavencimientoreprogramada BETWEEN '${body.d_fechavencimientoreprogramadainicio}' AND '${body.d_fechavencimientoreprogramadafin}')`;
            if(body.n_incio && body.n_fin) queryWhereJoin = `${queryWhereJoin} AND (can.calc_diasvencido >= ${body.n_incio} AND can.calc_diasvencido <= ${body.n_fin})`;

            const conn = await connect();
            const [responsePrestamos, column] : [any, any] = await conn.query(`CALL sp_Reporte_Prestamos_VencidosyNoVencidos(?,?,?,?)`,
            [queryWherePrestamo, queryWhereCancelacion, queryWhereJoin, body.d_fechaactual]);
            await conn.end();

            if(!responsePrestamos[0]) {
                return res.status(200).json({data:[], message: "No se encontró reportes asignados al perfil" });
            }
            return res.status(200).json({data:responsePrestamos[0], message: "Se obtuvo registros" });

        } else
        return res.status(503).json({ message: "Se debe enviar la compañía y fecha con la que se compara para filtrar." });
    } catch (error) {
        console.error(error);
        return Promise.reject({ success: false, error });
    }
}

export async function getPrestamosDetalladoPeriodo(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        body.c_compania			  		 = body.c_compania				   ? body.c_compania			  	: null;
        body.c_agencia			  		 = body.c_agencia				   ? body.c_agencia			  	    : null;
        body.c_prestamo			  		 = body.c_prestamo				   ? body.c_prestamo			  	: null;
        body.c_estado			  		 = body.c_estado				   ? body.c_estado			    	: null;
        body.n_cliente			  		 = body.n_cliente			       ? body.n_cliente			  		: null;
        body.n_diasvencido_inicio        = body.n_diasvencido_inicio       ? body.body.n_diasvencido_inicio : null;
        body.n_diasvencido_fin           = body.n_diasvencido_fin          ? body.body.n_diasvencido_fin    : null;
        body.c_vencido                    = body.c_vencido                 ? body.c_vencido                 : null;

        body.c_paiscodigo		  		 = body.c_paiscodigo		       ? body.c_paiscodigo		  		: null;
        body.c_departamentocodigo 		 = body.c_departamentocodigo  	   ? body.c_departamentocodigo  	: null;
        body.c_provinciacodigo	  		 = body.c_provinciacodigo	       ? body.c_provinciacodigo	  		: null;
        body.c_distritocodigo	  		 = body.c_distritocodigo	       ? body.c_distritocodigo	  		: null;

        body.d_fechacancelacioninicio	 = body.d_fechacancelacioninicio   ? body.d_fechacancelacioninicio	: null;
        body.d_fechacancelacionfin		 = body.d_fechacancelacionfin	   ? body.d_fechacancelacionfin		: null;

        body.d_fechadesembolsoinicio	 = body.d_fechadesembolsoinicio	   ? body.d_fechadesembolsoinicio	: null;
        body.d_fechadesembolsofin		 = body.d_fechadesembolsofin	   ? body.d_fechadesembolsofin	  	: null;

        body.d_fechavencimientoinicio	 = body.d_fechavencimientoinicio   ? body.d_fechavencimientoinicio	: null;
        body.d_fechavencimientofin		 = body.d_fechavencimientofin 	   ? body.d_fechavencimientofin		: null;


        body.d_fvencimientoreproinicio	 = body.d_fvencimientoreproinicio  ? body.d_fvencimientoreproinicio	: null;
        body.d_fvencimientoreprofin		 = body.d_fvencimientoreprofin	   ? body.d_fvencimientoreprofin	: null;

        body.d_fechacancelaciondetinicio	 = body.d_fechacancelaciondetinicio     ? body.d_fechacancelaciondetinicio	: null;
        body.d_fechacancelaciondetfin		 = body.d_fechacancelaciondetfin	    ? body.d_fechacancelaciondetfin	: null;

        body.d_fechaactual		 = body.d_fechaactual	    ? body.d_fechaactual	: null;

        if(body) {
            const conn = await connect();
            const [[rows,fields], response] : [any, any] = await conn.query(
                `CALL sp_Reporte_Prestamos_Detallado_Periodo(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                [body.c_compania,body.c_agencia,body.c_prestamo,body.c_estado,body.n_cliente,body.n_diasvencido_inicio,
                body.n_diasvencido_fin,body.c_vencido,body.c_paiscodigo,body.c_departamentocodigo,body.c_provinciacodigo,
                body.c_distritocodigo,body.d_fechacancelacioninicio,body.d_fechacancelacionfin,body.d_fechadesembolsoinicio,
                body.d_fechadesembolsofin,body.d_fechavencimientoinicio,body.d_fechavencimientofin,body.d_fvencimientoreproinicio,
                body.d_fvencimientoreprofin,body.d_fechacancelaciondetinicio,body.d_fechacancelaciondetfin,body.d_fechaactual]);
            await conn.end();
            const responseProcedure = rows;
            if(!responseProcedure[0]) {
                return res.status(200).json({message: "No se encontró préstamos" });
            }
            return res.status(200).json({data:responseProcedure, message: "Se obtuvo préstamos" });
        }
        return res.status(503).json({message: "No se está enviando el cuerpo de la consulta." });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}