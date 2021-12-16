import { Request, Response } from 'express'
import { connect } from '../database'
import { Distrito} from 'interfaces/distrito.interface'
import { ResultSetHeader } from "../interfaces/result"
import moment from 'moment'

export async function getDistritos(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        const  distrito: Distrito = body;
        const conn = await connect();
        const [rows, fields] = await conn.query('SELECT c_paiscodigo,c_departamentocodigo,c_provinciacodigo,c_distritocodigo,c_descripcion FROM MA_DISTRITO where c_estado="A"')
        await conn.end();
        const DistritoRes = rows as [Distrito];
        if(!DistritoRes[0]) {
            return res.status(200).json({ data:[], message: "No se encontró distrito" });
        }
        return res.status(200).json({ data:rows, message: "Se obtuvo registros" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function getDistritosAdmin(req: Request, res: Response): Promise<Response> {
    try {
        const conn = await connect();
        const [rows, fields] = await conn.query('SELECT * FROM MA_DISTRITO')
        await conn.end();
        const distritoRes =rows as [Distrito];
        if(!distritoRes[0]) {
            return res.status(200).json({ data:[], message: "No se encontró distrito" });
        }
        return res.status(200).json({ data:rows, message: "Se obtuvo registros" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function registerDistrito(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        if(body.c_usuarioregistro) {
            body.c_ultimousuario = body.c_usuarioregistro
            if(body.c_paiscodigo && body.c_departamentocodigo && body.c_provinciacodigo && body.c_distritocodigo && body.c_descripcion){
                const distrito: Distrito = body;
                const conn = await connect();
                const data = await conn.query('INSERT INTO MA_DISTRITO SET ?', [distrito]);
                await conn.end();
                const parsedRes: ResultSetHeader = data[0] as ResultSetHeader;
                return res.status(200).json({ success:true, data: distrito, message: "Se registró el distrito con éxito" });
            }return res.status(200).json({message: "Parámetros incompletos. Favor de completar los campos requeridos." });
        }return res.status(503).json({message: "No se está enviando el usuario que realiza el registro." });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error";
        if(errorAux.errno === 1062) message = "Existe un distrito con esos datos";
        return res.status(500).send({error: error, message: message});
    }
}

export async function updateDistrito(req: Request, res: Response): Promise<Response> {
    try {
        //Obtener datos
        const body = req.body;
        const c_paiscodigo = body.c_paiscodigo;
        const c_departamentocodigo = body.c_departamentocodigo;
        const c_provinciacodigo = body.c_provinciacodigo;
        const c_distritocodigo = body.c_distritocodigo;
        body.d_ultimafechamodificacion = moment().format('YYYY-MM-DD HH:MM:ss');
        const distrito: Distrito = req.body;
        const conn = await connect();
        await conn.query('UPDATE MA_DISTRITO SET ? WHERE c_paiscodigo = ? AND c_departamentocodigo = ? AND c_provinciacodigo = ? AND c_distritocodigo = ?', [distrito, c_paiscodigo, c_departamentocodigo, c_provinciacodigo, c_distritocodigo]);
        await conn.end();
        return res.status(200).json({ data: {...distrito}, message: "Se actualizó el distrito con éxito"  });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error.";
        if(errorAux.errno === 1062) message = "Existe un distrito con esos datos";
        return res.status(500).send({error: error, message: message});
    }
}

export async function getDistritoByCodigoDistrito(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        const  distrito: Distrito = body;
        if(distrito.c_paiscodigo && distrito.c_departamentocodigo && distrito.c_provinciacodigo && distrito.c_distritocodigo) {
            const conn = await connect();
            const [rows, fields] = await conn.query('SELECT * FROM MA_DISTRITO where c_paiscodigo=? AND c_departamentocodigo=? AND c_provinciacodigo=? AND c_distritocodigo=?',[distrito.c_paiscodigo,distrito.c_departamentocodigo,distrito.c_provinciacodigo,distrito.c_distritocodigo])
            await conn.end();
            const DistritoRes = rows as [Distrito];
            if(!DistritoRes[0]) {
                return res.status(200).json({ data:[], message: "No se encontró distrito" });
            }
            return res.status(200).json({ data:DistritoRes[0], message: "Se obtuvo registros" });
        }return res.status(200).json({ message: "Se debe enviar el código de pais, departamento, provincia y distrito para listar obtener los datos de distritos" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function deleteDistrito(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        const distrito: Distrito = body;
        if(distrito.c_paiscodigo && distrito.c_departamentocodigo && distrito.c_provinciacodigo && distrito.c_distritocodigo) {
            const conn = await connect();
            await conn.query('DELETE FROM MA_PROVINCIA WHERE c_paiscodigo = ? AND c_departamentocodigo = ? AND c_provinciacodigo = ? AND c_distritocodigo = ?', [distrito.c_paiscodigo,distrito.c_departamentocodigo,distrito.c_provinciacodigo,distrito.c_distritocodigo]);
            await conn.end();
            return res.status(200).json({ message: "Se eliminó la distrito con éxito"  });
        }return res.status(200).json({ message: "Se debe enviar el código del país, departamento, provincia y distrito"  });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error.";
        if(errorAux.errno === 1217) message = "No se puede eliminar el distrito debido a que contiene datos asociados a otras tablas";
        return res.status(500).send({error: error, message: message});
    }
}

/*
export async function registerProvincia(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        body.d_fecharegistro = moment().format('YYYY-MM-DD HH:MM:ss');
        if(body.c_codigousuario) body.c_usuarioregistro = body.c_codigousuario;
        body.c_estado = "A";
        const Provincia: Provincia = body;
        const conn = await connect();
        const data = await conn.query('INSERT INTO MA_PROVINCIA SET ?', [Provincia]);
        await conn.end();
        const parsedRes: ResultSetHeader = data[0] as ResultSetHeader;
        return res.status(200).json({ success:true, data: Provincia, message: "Se registró la provincia con éxito" });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "";
        if(errorAux.errno === 1062) message = "Existe una provincia con esos datos";
        return res.status(500).send({error: error, message: message});
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
        if(body.c_codigousuario) body.c_ultimousuario = body.c_codigousuario;
        const Provincia: Provincia = req.body;
        const conn = await connect();
        await conn.query('UPDATE MA_PROVINCIA SET ? WHERE c_paiscodigo = ? AND c_departamentocodigo = ? AND c_provinciacodigo = ?', [Provincia, c_paiscodigo, c_departamentocodigo, c_provinciacodigo]);
        await conn.end();
        return res.status(200).json({ success:true, data: {...Provincia}, message: "Se actualizó la provincia con éxito"  });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error.";
        if(errorAux.errno === 1062) message = "Existe una provincia con esos datos";
        return res.status(500).send({error: error, message: message});
    }
}

export async function getProvinciaByNPerfil(req: Request, res: Response): Promise<Response> {
    try {
        const c_paiscodigo = req.query.c_paiscodigo;
        const c_departamentocodigo = req.query.c_departamentocodigo;
        const c_provinciacodigo = req.query.c_provinciacodigo;
        const conn = await connect();
        const data = await conn.query('SELECT * FROM MA_PROVINCIA WHERE c_paiscodigo = ? AND c_departamentocodigo = ? AND c_provinciacodigo = ?', [c_paiscodigo, c_departamentocodigo, c_provinciacodigo]);
        await conn.end();
        const ProvinciaRes = data[0] as [Provincia];
        if(!ProvinciaRes[0]) {
            return res.status(200).json({ success:false, data:{}, message: "No se encontró la provincia" });
        }
        return res.status(200).json({ success:true, data: ProvinciaRes[0], message: "Se obtuvo la provincia con éxito" });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}*/