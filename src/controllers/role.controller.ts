import { Request, Response } from 'express'
import { connect } from '../database'
import { Role } from '../interfaces/role.interface'
import { ResultSetHeader } from "../interfaces/result"

export async function getRoles(req: Request, res: Response): Promise<Response> {
    try {
        const conn = await connect();
        const data = await conn.query('SELECT * FROM role')
        const rolesRes = data[0] as [Role];
        if(!rolesRes[0]) {
            return res.status(200).json({succes: true, data:[], message: "No se encontró roles"});
        }
        return res.status(200).json({data:data[0], message: "Se obtuvo registros" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function registerRole(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        body.status = 1;
        const role: Role = body;
        const conn = await connect();
        const data = await conn.query('INSERT INTO role SET ?', [role]);
        const parsedRes: ResultSetHeader = data[0] as ResultSetHeader;
        return res.status(200).json({ success: true, data: role, id: parsedRes.insertId, message: "Se registró el rol con éxito" });
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
        const role: Role = req.body;
        const id = req.params.id;
        const conn = await connect();
        const data = await conn.query('UPDATE role SET ? WHERE id = ?', [role, id]);
        return res.status(200).json({ success: true, data: {...role, id: parseInt(id)}, message: "Se actualizó el rol con éxito"  });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "";
        if(errorAux.errno === 1062) message = "Existe un rol con esos datos";
        return res.status(500).send({error: error, message: message});
    }
}

export async function getRoleById(req: Request, res: Response): Promise<Response> {
    try {
        const id = req.params.id;
        const conn = await connect();
        const data = await conn.query('SELECT * FROM role WHERE id = ?', [id]);
        const roleRes = data[0] as [Role];
        if(!roleRes[0]) {
            return res.status(200).json({succes: true, data:{}, message: "No se encontró el rol"});
        }
        return res.status(200).json({succes: true, data: roleRes[0], message: "Se obtuvo el rol con éxito"});
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}