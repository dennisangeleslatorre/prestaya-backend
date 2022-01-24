import { Request, Response } from 'express'
import { connect } from '../database'
import { Reporte } from 'interfaces/reporte.interface'
import moment from 'moment'
import { Prestamo } from 'interfaces/prestamo.inteface';

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

export async function getDataReporteResumidos(req: Request, res: Response): Promise<Response> {
    try {
        //const n_perfil = req.body.n_perfil;
        const conn = await connect();
        const [rows, fields] = await conn.query(`SELECT p.n_cliente, p.c_nombrescompleto, p.c_monedaprestamo, SUM(p.n_montoprestamo) as calc_sumamontoprestamo, SUM(p.n_montointereses) as calc_sumamontointereses, SUM(p.n_montototalprestamo) as calc_sumamontototalprestamo, SUM(pp.n_montovalortotal) as calc_sumamontovalorproductos, SUM(pc.n_montointeresescancelar) as calc_sumainterecamcelado, SUM(pc.n_montoprestamocancelar) as calc_montoprestamocancelado, SUM(pc.n_montocomisioncancelar) as calc_sumacomisioncancelada, SUM(pc.n_montototalcancelar) as calc_sumamontototalcancelado FROM co_prestamos p INNER JOIN co_prestamoscancelaciones pc ON p.c_compania = pc.c_compania AND p.c_prestamo = pc.c_prestamo INNER JOIN co_prestamosproductos pp ON p.c_compania = pp.c_compania AND p.c_prestamo = pp.c_prestamo WHERE ( p.d_fechadesembolso BETWEEN '2021-12-01' AND '2022-01-31' ) AND ( pc.d_fechacancelacion BETWEEN '2021-12-01' AND '2022-01-31' ) AND p.n_cliente = 1000 AND p.c_compania = '00100000' GROUP BY p.n_cliente, p.c_monedaprestamo;`);
        await conn.end();
        const reporteRes = rows as [Prestamo];
        if(!reporteRes[0]) {
            return res.status(200).json({data:[], message: "No se datos" });
        }
        return res.status(200).json({data:rows, message: "Se obtuvo datos" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}