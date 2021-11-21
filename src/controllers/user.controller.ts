import { Request, Response } from 'express'
import { connect } from '../database'
import { User } from '../interfaces/user.interface'
import { ResultSetHeader, Result } from "../interfaces/result"
import moment from 'moment'
import * as bcrypt from 'bcrypt'

export async function getUsers(req: Request, res: Response) {
    try {
        const conn = await connect();
        const data = await conn.query('SELECT * FROM user')
        const userRes = data[0] as [User];
        if(!userRes[0]) {
            return res.status(200).json({succes: true, data:[], message: "No se encontró usuarios"});
        }
        return res.status(200).json({data:data[0], message: "Se obtuvo usuarios" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function registerUser(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        body.status = 1;
        body.created_at = moment().format('YYYY-MM-DD HH:MM:SS');
        body.password = bcrypt.hashSync(body.password, 10);
        const user: User = body;
        const conn = await connect();
        const data = await conn.query('INSERT INTO user SET ?', [user]);
        const parsedRes: ResultSetHeader = data[0] as ResultSetHeader;
        return res.status(200).json({ success: true, data: user, id: parsedRes.insertId, message: "Se registró el usuario con éxito" });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error";
        if(errorAux.errno === 1062) message = "Existe un usuario con esos datos";
        return res.status(500).send({error: error, message: message});
    }
}

export async function updateUser(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        body.updated_at = moment().format('YYYY-MM-DD HH:MM:SS');
        if(body.password != undefined){
            body.password = bcrypt.hashSync(body.password, 10)
        }
        const user: User = body;
        const id = req.params.id;
        const conn = await connect();
        const data = await conn.query('UPDATE user SET ? WHERE id = ?', [user, id]);
        return res.status(200).json({ success: true, data: {...user, id: parseInt(id)}, message: "Se actualizó el usuario con éxito"  });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "";
        if(errorAux.errno === 1062) message = "Existe un usuario con esos datos";
        return res.status(500).send({error: error, message: message});
    }
}

export async function getUserById(req: Request, res: Response): Promise<Response> {
    try {
        const id = req.params.id;
        const conn = await connect();
        const data = await conn.query('SELECT * FROM user WHERE id = ?', [id]);
        const userRes = data[0] as [User];
        if(!userRes[0]) {
            return res.status(200).json({succes: true, data:{}, message: "No se encontró el usuario"});
        }
        return res.status(200).json({succes: true, data: userRes[0], message: "Se obtuvo el usuario con éxito"});
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}

export async function getByUsername(username:string): Promise<Result> {
    try {
        const conn = await connect();
        const res = await conn.query('SELECT * FROM user u INNER JOIN role r on u.role_id = r.id WHERE u.username = ?', username);
        return Promise.resolve({ success: true, data: res[0] });
    } catch (error) {
        console.error(error);
        return Promise.reject({ success: false, error });
    }
}

export async function  login(req: Request, res: Response): Promise<Response> {
    try {
        const { username, password } = req.body;
        const userRes = await getByUsername(username);
        const user = userRes.data as [User];
        if (user[0] != undefined && user[0].password && bcrypt.compareSync(password, user[0].password)) {
            delete user[0].password;
            return res.status(200).json({succes: true, data:user[0], message: "Login con éxito"});
        } else {
            return res.status(400).json({success: false, message: "Usuario o contraseña incorrectos."});
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: error, message: "Hubo un error."});
    }
}