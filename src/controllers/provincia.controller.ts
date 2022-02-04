import { Request, Response } from 'express'
import { connect } from '../database'
import { Provincia } from 'interfaces/provincia.interface'
import { ResultSetHeader } from "../interfaces/result"
import moment from 'moment'

export async function getProvincias(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        const  provincia: Provincia = body;
        const conn = await connect();
        const [rows, fields] = await conn.query('SELECT c_paiscodigo,c_departamentocodigo,c_provinciacodigo,c_descripcion FROM ma_provincia where c_estado="A"')
        await conn.end();
        const ProvinciasRes = rows as [Provincia];
        if(!ProvinciasRes[0]) {
            return res.status(200).json({ data:[], message: "No se encontró Provincias" });
        }
        return res.status(200).json({ data:rows, message: "Se obtuvo registros" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function getProvinciasAdmin(req: Request, res: Response): Promise<Response> {
    try {
        const conn = await connect();
        const [rows, fields] = await conn.query(`
            SELECT pr.*, p.c_descripcion as pais, d.c_descripcion as departamento FROM ma_provincia pr
            INNER JOIN ma_pais p ON p.c_paiscodigo = pr.c_paiscodigo
            INNER JOIN ma_departamento d ON d.c_paiscodigo = pr.c_paiscodigo AND pr.c_departamentocodigo = d.c_departamentocodigo
        `)
        await conn.end();
        const provinciaRes =rows as [Provincia];
        if(!provinciaRes[0]) {
            return res.status(200).json({ data:[], message: "No se encontró provincia" });
        }
        return res.status(200).json({ data:rows, message: "Se obtuvo registros" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function registerProvincia(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        if(body.c_usuarioregistro) {
            body.c_ultimousuario = body.c_usuarioregistro
            if(body.c_paiscodigo && body.c_departamentocodigo && body.c_provinciacodigo && body.c_descripcion){
                const provincia: Provincia = body;
                const conn = await connect();
                const data = await conn.query('INSERT INTO ma_provincia SET ?', [provincia]);
                await conn.end();
                const parsedRes: ResultSetHeader = data[0] as ResultSetHeader;
                return res.status(200).json({ success:true, data: provincia, message: "Se registró el provincia con éxito" });
            }return res.status(200).json({message: "Parámetros incompletos. Favor de completar los campos requeridos." });
        }return res.status(503).json({message: "No se está enviando el usuario que realiza el registro." });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error";
        if(errorAux.errno === 1062) message = "Existe un provincia con esos datos";
        return res.status(500).send({error: error, message: message});
    }
}

export async function getProvinciaByCodigoProvincia(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        const  provincia: Provincia = body;
        if(provincia.c_paiscodigo && provincia.c_departamentocodigo && provincia.c_provinciacodigo) {
            const conn = await connect();
            const [rows, fields] = await conn.query('SELECT * FROM ma_provincia where c_paiscodigo=? AND c_departamentocodigo=? AND c_provinciacodigo=?',[provincia.c_paiscodigo,provincia.c_departamentocodigo,provincia.c_provinciacodigo])
            await conn.end();
            const ProvinciasRes = rows as [Provincia];
            if(!ProvinciasRes[0]) {
                return res.status(200).json({ data:[], message: "No se encontró Provincia" });
            }
            return res.status(200).json({ data:ProvinciasRes[0], message: "Se obtuvo registros" });
        }return res.status(200).json({ message: "Se debe enviar el código de pais, departamento y provincia para obtener los datos de la provincia" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function updateProvincia(req: Request, res: Response): Promise<Response> {
    try {
        //Obtener datos
        const body = req.body;
        const c_paiscodigo = body.c_paiscodigo;
        const c_departamentocodigo = body.c_departamentocodigo;
        const c_provinciacodigo = body.c_provinciacodigo;
        body.d_ultimafechamodificacion = moment().format('YYYY-MM-DD HH:MM:ss');
        const Provincia: Provincia = req.body;
        const conn = await connect();
        await conn.query('UPDATE ma_provincia SET ? WHERE c_paiscodigo = ? AND c_departamentocodigo = ? AND c_provinciacodigo = ?', [Provincia, c_paiscodigo, c_departamentocodigo, c_provinciacodigo]);
        await conn.end();
        return res.status(200).json({ data: {...Provincia}, message: "Se actualizó la provincia con éxito" });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error.";
        if(errorAux.errno === 1062) message = "Existe una provincia con esos datos";
        return res.status(500).send({error: error, message: message});
    }
}

export async function deleteProvincia(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        const provincia: Provincia = body;
        if(provincia.c_paiscodigo && provincia.c_departamentocodigo && provincia.c_provinciacodigo) {
            const conn = await connect();
            await conn.query('DELETE FROM ma_provincia WHERE c_paiscodigo = ? AND c_departamentocodigo = ? AND c_provinciacodigo = ?', [provincia.c_paiscodigo,provincia.c_departamentocodigo,provincia.c_provinciacodigo]);
            await conn.end();
            return res.status(200).json({ message: "Se eliminó la provincia con éxito"  });
        }return res.status(200).json({ message: "Se debe enviar el código del país, departamento y provincia"  });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error.";
        if(errorAux.errno === 1217) message = "No se puede eliminar la provincia debido a que tiene distritos asociados";
        return res.status(500).send({error: error, message: message});
    }
}