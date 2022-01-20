import { Request, Response } from 'express'
import { connect } from '../database'
import { Departamento } from 'interfaces/departamento.interface'
import { ResultSetHeader } from "../interfaces/result"
import moment from 'moment'

export async function getDepartamentos(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        const departamento: Departamento = body;
        const conn = await connect();
        const [rows, fields] = await conn.query('SELECT * FROM ma_departamento where c_estado="A"');
        await conn.end();
        const departamentosRes =rows as [Departamento];
        if(!departamentosRes[0]) {
            return res.status(200).json({ data:[], message: "No se encontró departamentos" });
        }
        return res.status(200).json({ data:rows, message: "Se obtuvo registros" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function getDepartamentosAdmin(req: Request, res: Response): Promise<Response> {
    try {
        const conn = await connect();
        const [rows, fields] = await conn.query('SELECT * FROM ma_departamento')
        await conn.end();
        const departamentosRes =rows as [Departamento];
        if(!departamentosRes[0]) {
            return res.status(200).json({ data:[], message: "No se encontró departamentos" });
        }
        return res.status(200).json({ data:rows, message: "Se obtuvo registros" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}


export async function registerDepartamento(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        if(body.c_usuarioregistro) {
            body.c_ultimousuario = body.c_usuarioregistro
            const conn = await connect();
            const [rows, fields]  = await conn.query('SELECT c_estado FROM ma_pais where c_paiscodigo= ?', [body.c_paiscodigo]);
            await conn.end();
            const departamentosRes =rows as [Departamento];
            if(!departamentosRes[0] && departamentosRes[0]==='A') {        
                if(body.c_paiscodigo && body.c_departamentocodigo && body.c_descripcion){
                    const departamento: Departamento = body;
                    const conn = await connect();
                    await conn.query('INSERT INTO ma_departamento SET ?', [departamento]);
                    await conn.end();
                    return res.status(200).json({ success:true, data: departamento, message: "Se registró el departamento con éxito" });
                }return res.status(200).json({message: "Parámetros incompletos. Favor de completar los campos requeridos." });
            }return res.status(503).json({message: "El país debe encontrarse activo." });
        }return res.status(503).json({message: "No se está enviando el usuario que realiza el registro." });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error";
        if(errorAux.errno === 1062) message = "Existe un departamento con esos datos";
        return res.status(500).send({error: error, message: message});
    }
}


export async function getDepartamentoByCodigoDepartamento(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        const departamento: Departamento = body;
        if(departamento.c_paiscodigo && departamento.c_departamentocodigo) {
            const conn = await connect();
            const [rows, fields] = await conn.query('SELECT * FROM ma_departamento WHERE c_paiscodigo=? AND c_departamentocodigo=?',[departamento.c_paiscodigo,departamento.c_departamentocodigo])
            await conn.end();
            const departamentosRes =rows as [Departamento];
            if(!departamentosRes[0]) {
                return res.status(200).json({ data:[], message: "No se encontró departamento" });
            }
            return res.status(200).json({ data:departamentosRes[0], message: "Se obtuvo registros" });
        }return res.status(200).json({ message: "Se debe enviar el código pais y el código departamento para obtener los datos de departamento" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function updateDepartamento(req: Request, res: Response): Promise<Response> {
    try {
        //Obtener datos
        const body = req.body;
        const c_paiscodigo = body.c_paiscodigo;
        const c_departamentocodigo = body.c_departamentocodigo;
        body.d_ultimafechamodificacion = moment().format('YYYY-MM-DD HH:MM:ss');
        const departamento: Departamento = req.body;
        const conn = await connect();
        await conn.query('UPDATE ma_departamento SET ? WHERE c_paiscodigo = ? AND c_departamentocodigo = ?', [departamento, c_paiscodigo, c_departamentocodigo]);
        await conn.end();
        return res.status(200).json({ data: {...departamento}, message: "Se actualizó el departamento con éxito"  });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error.";
        if(errorAux.errno === 1062) message = "Existe un departamento con esos datos";
        return res.status(500).send({error: error, message: message});
    }
}

export async function deleteDepartamento(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        const departamento: Departamento = body;
        if(departamento.c_paiscodigo && departamento.c_departamentocodigo) {
            const conn = await connect();
            await conn.query('DELETE FROM ma_departamento WHERE c_paiscodigo = ? AND c_departamentocodigo = ?', [departamento.c_paiscodigo,departamento.c_departamentocodigo]);
            await conn.end();
            return res.status(200).json({ message: "Se eliminó el departamento con éxito"  });
        }return res.status(200).json({ message: "Se debe enviar el código del país y departamento"  });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error.";
        if(errorAux.errno === 1217) message = "No se puede eliminar el departamento debido a que tiene provincias asociadas";
        return res.status(500).send({error: error, message: message});
    }
}


/*
export async function getDepartamentoByNPerfil(req: Request, res: Response): Promise<Response> {
    try {
        const c_paiscodigo = req.query.c_paiscodigo;
        const c_departamentocodigo = req.query.c_departamentocodigo;
        const conn = await connect();
        const data = await conn.query('SELECT * FROM ma_departamento WHERE c_paiscodigo = ? AND c_departamentocodigo', [c_paiscodigo, c_departamentocodigo]);
        await conn.end();
        const departamentoRes = data[0] as [Departamento];
        if(!departamentoRes[0]) {
            return res.status(200).json({ success:false, data:{}, message: "No se encontró el departamento" });
        }
        return res.status(200).json({ success:true, data: departamentoRes[0], message: "Se obtuvo el departamento con éxito" });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}*/