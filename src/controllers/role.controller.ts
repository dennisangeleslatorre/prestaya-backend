import { Request, Response } from 'express'
import { connect } from '../database'
import { Role } from '../interfaces/role.interface'
import { ResultSetHeader } from "../interfaces/result"
import moment from 'moment'

export async function getRoles(req: Request, res: Response): Promise<Response> {
    try {
        const conn = await connect();
        const data = await conn.query('SELECT * FROM ma_perfil')
        await conn.end();
        const rolesRes = data[0] as [Role];
        if(!rolesRes[0]) {
            return res.status(200).json({ success:false, data:[], message: "No se encontró roles" });
        }
        return res.status(200).json({ success:true, data:data[0], message: "Se obtuvo registros" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}


export async function getRolesActivos(req: Request, res: Response): Promise<Response> {
    try {
        const conn = await connect();
        const data = await conn.query('SELECT * FROM ma_perfil WHERE C_ESTADO="A"')
        await conn.end();
        const rolesRes = data[0] as [Role];
        if(!rolesRes[0]) {
            return res.status(200).json({ success:false, data:[], message: "No se encontró roles" });
        }
        return res.status(200).json({ success:true, data:data[0], message: "Se obtuvo registros" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function registerRole(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        if(body.c_usuarioregistro) {
            body.d_fecharegistro = moment().format('YYYY-MM-DD HH:MM:ss');
            body.c_estado = "A";
            const role: Role = body;
            const conn = await connect();
            const data = await conn.query('INSERT INTO ma_perfil SET ?', [role]);
            await conn.end();
            return res.status(200).json({ data: role, message: "Se registró el rol con éxito" });
        }
        return res.status(500).json({ message: "No se está enviando el usuario que realiza el registro."  });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "";
        if(errorAux.errno === 1062) message = "Existe un rol con esos datos";
        return res.status(500).send({error: error, message: message});
    }
}

export async function updateRole(req: Request, res: Response): Promise<Response> {
    try {
        //Obtener datos
        const n_perfil = req.params.n_perfil;
        const body = req.body;
        if (body.c_ultimousuario) {
            body.d_ultimafechamodificacion = moment().format('YYYY-MM-DD HH:MM:ss');
            const role: Role = req.body;
            const conn = await connect();
            await conn.query('UPDATE ma_perfil SET ? WHERE n_perfil = ?', [role, n_perfil]);
            await conn.end();
            return res.status(200).json({ message: "Se actualizó el rol con éxito"  });
        }
        return res.status(500).json({ message: "No se está enviando el usuario que realiza la actualización."  });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error.";
        if(errorAux.errno === 1062) message = "Existe un rol con esos datos";
        return res.status(500).send({error: error, message: message});
    }
}

export async function getRoleByNPerfil(req: Request, res: Response): Promise<Response> {
    try {
        const n_perfil = req.params.n_perfil;
        const conn = await connect();
        const data = await conn.query('SELECT * FROM ma_perfil WHERE n_perfil = ?', [n_perfil]);
        await conn.end();
        const roleRes = data[0] as [Role];
        if(!roleRes[0]) {
            return res.status(503).json({ message: "No se encontró el rol" });
        }
        return res.status(200).json({ success:true, data: roleRes[0], message: "Se obtuvo el rol con éxito" });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}

export async function deleteRole(req: Request, res: Response): Promise<Response> {
    try {
        const n_perfil = req.params.n_perfil;
        if(n_perfil) {
            const conn = await connect();
            await conn.query('DELETE FROM ma_perfil WHERE n_perfil = ?', [n_perfil]);
            await conn.end();
            return res.status(200).json({ message: "Se eliminó el perfil con éxito." });
        }
        return res.status(500).json({ message: "No se está enviando el código para la eliminación."  });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error.";
        if(errorAux.errno === 1217) message = "No se puede eliminar o actualizar un campo principal.";
        return res.status(500).json({ error: error, message: message });
    }
}