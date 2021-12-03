import { Request, Response } from 'express'
import { connect } from '../database'
import { User } from '../interfaces/user.interface'
import { ResultSetHeader, Result } from "../interfaces/result"
import moment from 'moment'
import * as bcrypt from 'bcrypt'

export async function getUsers(req: Request, res: Response) {
    try {
        const conn = await connect();
        const data = await conn.query('SELECT * FROM MA_USUARIOS');
        await conn.end();
        const userRes = data[0] as [User];
        if(!userRes[0]) {
            return res.status(200).json({ success: false, data:[], message: "No se encontró usuarios." });
        }
        return res.status(200).json({ success: true, data:data[0], message: "Se obtuvo usuarios." });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function registerUser(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        if(body.c_codigousuario_r) body.c_usuarioregistro = body.c_codigousuario_r;
        body.d_fecharegistro = moment().format('YYYY-MM-DD HH:MM:ss');
        body.c_clave = bcrypt.hashSync(body.c_clave, 10);
        const user: User = body;
        const conn = await connect();
        const data = await conn.query('INSERT INTO MA_USUARIOS SET ?', [user]);
        await conn.end();
        const parsedRes: ResultSetHeader = data[0] as ResultSetHeader;
        return res.status(200).json({ success: true, data: user, message: "Se registró el usuario con éxito." });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error";
        if(errorAux.errno === 1062) message = "Existe un usuario con esos datos.";
        return res.status(500).send({error: error, message: message});
    }
}

export async function updateUser(req: Request, res: Response): Promise<Response> {
    try {
        const c_codigousuario = req.params.c_codigousuario;
        const body = req.body;
        body.d_ultimafechamodificacion = moment().format('YYYY-MM-DD HH:MM:ss');//AGREGAR UN CAMPO AL BODY
        if(body.c_codigousuario_m) body.c_ultimousuario = body.c_codigousuario_m;
        if(body.c_clave != undefined){
            body.c_clave = bcrypt.hashSync(body.c_clave, 10)
        }
        const user: User = body;
        const conn = await connect();
        await conn.query('UPDATE MA_USUARIOS SET ? WHERE c_codigousuario = ?', [user, c_codigousuario]);
        await conn.end();
        return res.status(200).json({ success: true, data: {...user, message: "Se actualizó el usuario con éxito." }});
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "";
        if(errorAux.errno === 1062) message = "Existe un usuario con esos datos.";
        return res.status(500).send({error: error, message: message});
    }
}

export async function getUserByCodigoUsuario(req: Request, res: Response): Promise<Response> {
    try {
        const c_codigousuario = req.params.c_codigousuario;
        const conn = await connect();
        const data = await conn.query('SELECT * FROM MA_USUARIOS WHERE c_codigousuario = ?', [c_codigousuario]);
        await conn.end();
        const userRes = data[0] as [User];
        if(!userRes[0]) {
            return res.status(200).json({ success: false, data:{}, message: "No se encontró el usuario." });
        }
        return res.status(200).json({ success: true, data: userRes[0], message: "Se obtuvo el usuario con éxito." });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}

export async function getByUsername(c_codigousuario:string): Promise<Result> {
    try {
        const conn = await connect();
        const res = await conn.query('SELECT u.c_nombres, u.c_codigousuario, u.c_estado, u.c_clave, r.c_codigoperfil, r.c_paginas, r.c_botones FROM MA_USUARIOS u INNER JOIN MA_PERFIL r on u.n_perfil = r.n_perfil WHERE u.c_codigousuario = ?', c_codigousuario);
        await conn.end();
        return Promise.resolve({ success: true, data: res[0] });
    } catch (error) {
        console.error(error);
        return Promise.reject({ success: false, error });
    }
}

export async function  login(req: Request, res: Response): Promise<Response> {
    try {
        const { c_codigousuario, c_clave } = req.body;
        const userRes = await getByUsername(c_codigousuario);
        const user = userRes.data as [User];
        if (!user.length) return res.status(200).json({ success: false, message: "Usuario no registrado." });
        if (user[0].c_estado !== "A") return res.status(200).json({ success: false, message: "El usuario no está activo." });
        if (user[0] != undefined && user[0].c_clave && bcrypt.compareSync(c_clave, user[0].c_clave)) {
            delete user[0].c_clave;
            user[0].a_paginas = user[0].c_paginas.split(",");
            return res.status(200).json({ success: true, data:user[0], message: "Login con éxito" });
        } else {
            return res.status(200).json({ success: false, message: "Usuario y/o contraseña incorrectos." });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error, message: "Hubo un error." });
    }
}