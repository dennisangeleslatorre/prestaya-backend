import { Request, Response } from 'express'
import { connect } from '../database'
import { User } from '../interfaces/user.interface'
import { ResultSetHeader, Result } from "../interfaces/result"
import moment from 'moment'
import * as bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { RowDataPacket } from 'mysql2'

export async function getUsers(req: Request, res: Response) {
    try {
        const conn = await connect();
        const data = await conn.query('SELECT A.*, B.c_codigoperfil FROM ma_usuarios A JOIN ma_perfil B ON A.n_perfil=B.n_perfil');
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
        if(body.c_usuarioregistro) {
            body.d_fecharegistro = moment().format('YYYY-MM-DD HH:MM:ss');
            body.c_clave = bcrypt.hashSync(body.c_clave, 10);
            const user: User = body;
            const conn = await connect();
            const data = await conn.query('INSERT INTO ma_usuarios SET ?', [user]);
            await conn.end();
            const parsedRes: ResultSetHeader = data[0] as ResultSetHeader;
            return res.status(200).json({ success: true, data: user, message: "Se registró el usuario con éxito." });
        }
        return res.status(500).json({ message: "No se está enviando el usuario que realiza el registro."  });
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
        if (body.c_ultimousuario) {
            body.d_ultimafechamodificacion = moment().format('YYYY-MM-DD HH:MM:ss');//AGREGAR UN CAMPO AL BODY
            if(body.c_clave != undefined){
                body.c_clave = bcrypt.hashSync(body.c_clave, 10)
            }
            const user: User = body;
            const conn = await connect();
            await conn.query('UPDATE ma_usuarios SET ? WHERE c_codigousuario = ?', [user, c_codigousuario]);
            await conn.end();
            return res.status(200).json({ success: true, data: {...user, message: "Se actualizó el usuario con éxito." }});
        }
        return res.status(500).json({ message: "No se está enviando el usuario que realiza la actualización."  });
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
        const data = await conn.query('SELECT * FROM ma_usuarios WHERE c_codigousuario = ?', [c_codigousuario]);
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
        const res = await conn.query('SELECT u.c_nombres, u.c_codigousuario, u.c_estado, u.c_clave, r.c_codigoperfil, r.n_perfil, r.c_paginas, r.c_botones FROM ma_usuarios u INNER JOIN ma_perfil r on u.n_perfil = r.n_perfil WHERE u.c_codigousuario = ?', c_codigousuario);
        await conn.end();
        return Promise.resolve({ success: true, data: res[0] });
    } catch (error) {
        console.error(error);
        return Promise.reject({ success: false, error });
    }
}

export async function auditLogin(c_descripcion:string, c_usuario:string): Promise<Result> {
    try {
        const d_fechalogin = moment().format('YYYY-MM-DD HH:MM:ss');
        const conn = await connect();
        await conn.query(`INSERT INTO aud_loginauditoria (c_descripcion, c_usuario, d_fechalogin) values(?, ?, ?)`, [c_descripcion, c_usuario, d_fechalogin]);
        await conn.end();
        return Promise.resolve({ success: true, data:{} });
    } catch (error) {
        console.error(error);
        return Promise.reject({ success: false, error });
    }
}

export async function  login(req: Request, res: Response): Promise<Response> {
    const secret = "PrestaYA"
    try {
        const { c_codigousuario, c_clave, c_descripcion_login } = req.body;
        const userRes = await getByUsername(c_codigousuario);
        const user = userRes.data as [User];
        if (!user.length) return res.status(200).json({ success: false, message: "Usuario no registrado." });
        if (user[0].c_estado !== "A") return res.status(200).json({ success: false, message: "El usuario no está activo." });
        if (user[0] != undefined && user[0].c_clave && bcrypt.compareSync(c_clave, user[0].c_clave)) {
            await auditLogin(c_descripcion_login, c_codigousuario);
            delete user[0].c_clave;
            user[0].a_paginas = user[0].c_paginas.split(",");

            const payload = {
                sub: user[0].c_codigousuario
          };
          const token = jwt.sign(payload, secret);

            return res.status(200).json({ success: true, data:user[0], message: "Login con éxito", token:token });
        } else {
            return res.status(200).json({ success: false, message: "Usuario y/o contraseña incorrectos." });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error, message: "Hubo un error." });
    }
}

export async function deleteUser(req: Request, res: Response): Promise<Response> {
    try {
        const c_codigousuario = req.params.c_codigousuario;
        if(c_codigousuario) {
            const conn = await connect();
            await conn.query('DELETE FROM ma_usuarios WHERE c_codigousuario = ?', [c_codigousuario]);
            await conn.end();
            return res.status(200).json({ message: "Se eliminó el usuario con éxito." });
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

export async function changePassword(req: Request, res: Response): Promise<Response> {
    try {
        const c_codigousuario = req.params.c_codigousuario;
        const body = req.body;
        if (body.c_ultimousuario) {
            body.d_ultimafechamodificacion = moment().format('YYYY-MM-DD HH:MM:ss');//AGREGAR UN CAMPO AL BODY
            if(body.c_clave != undefined){
                body.c_clave = bcrypt.hashSync(body.c_clave, 10)
            } else {
                return res.status(500).json({ message: "No se está enviando la nueva contraseña." });
            }
            const conn = await connect();
            await conn.query('UPDATE ma_usuarios SET c_clave = ?, d_ultimafechamodificacion = ?, c_ultimousuario = ? WHERE c_codigousuario = ?',
                    [body.c_clave, body.d_ultimafechamodificacion, body.c_ultimousuario, c_codigousuario]);
            await conn.end();
            return res.status(200).json({ message: "Se actualizó la contraseña con éxito." });
        }
        return res.status(500).json({ message: "No se está enviando el usuario que realiza la actualización."  });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "";
        if(errorAux.errno === 1062) message = "Existe un usuario con esos datos.";
        return res.status(500).send({error: error, message: message});
    }
}

export async function getAgenciaXUsuario(req: Request, res: Response) {
    try {
        const c_codigousuario = req.body.c_codigousuario;
        const c_compania = req.body.c_compania;
        let listUsuarioxAgencia = []
        const conn = await connect();
        const [responseProcedure, column] : [any, any]  = await conn.query('CALL prestaya.sp_ListarDinamico_UsuarioxAgencia(?,?)',[c_compania, c_codigousuario]);
        await conn.end();
        listUsuarioxAgencia = responseProcedure[0] as [any];
        if (listUsuarioxAgencia && listUsuarioxAgencia.length > 0)
            return res.status(200).json({data:listUsuarioxAgencia, message: "Se obtuvieron registros." });
        return  res.status(200).json({data:[], message: "No se encontró registros." });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error);
    }
}