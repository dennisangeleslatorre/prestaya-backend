import { Request, Response } from 'express'
import { connect } from '../database'
import { Cliente } from 'interfaces/cliente.interface'
import { ResultSetHeader } from "../interfaces/result"
import moment from 'moment'


export async function getClientesXCompania(req: Request, res: Response): Promise<Response> {
    try {
        const c_compania = req.params.c_codigocompania;
        const conn = await connect();
        const [rows, fields] = await conn.query('SELECT * FROM MA_CLIENTES where c_estado="A" AND c_compania=?',[c_compania])
        await conn.end();
        const clientesRes = rows as [Cliente];
        if(!clientesRes[0]) {
            return res.status(200).json({data:[], message: "No se encontró clientes" });
        }
        return res.status(200).json({data:rows, message: "Se obtuvo registros" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function getClientes(req: Request, res: Response): Promise<Response> {
    try {
        const conn = await connect();
        const [rows, fields] = await conn.query('SELECT * FROM MA_CLIENTES where c_estado="A"')
        await conn.end();
        const clientesRes = rows as [Cliente];
        if(!clientesRes[0]) {
            return res.status(200).json({data:[], message: "No se encontró clientes" });
        }
        return res.status(200).json({data:rows, message: "Se obtuvo registros" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function getClientesAdmin(req: Request, res: Response): Promise<Response> {
    try {
        const conn = await connect();
        const [rows, fields] = await conn.query('SELECT * FROM MA_CLIENTES')
        await conn.end();
        const ClientesRes = rows as [Cliente];
        if(!ClientesRes[0]) {
            return res.status(200).json({data:[], message: "No se encontró clientes" });
        }
        return res.status(200).json({data:rows, message: "Se obtuvo clientes" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function getClienteByCodigoCliente(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        const cliente: Cliente = body;
        if(cliente.c_compania && cliente.n_cliente) {
            const conn = await connect();
            const [rows, fields] = await conn.query('SELECT * FROM MA_CLIENTES where c_compania=? AND n_cliente=?',[cliente.c_compania,cliente.n_cliente])
            await conn.end();
            const clienteRes =rows as [Cliente];
            if(!clienteRes[0]) {
                return res.status(200).json({ message: "No se encontró parámetros" });
            }
            return res.status(200).json({ data:clienteRes[0], message: "Se obtuvo registros" });
        }return res.status(200).json({ message: "Se debe enviar el código de compañía y número de cliente para listar la información" });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}

export async function registerCliente(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        if(body.c_usuarioregistro) {
            body.c_ultimousuario = body.c_usuarioregistro;
            if(body.c_compania && body.n_cliente && body.c_apellidospaterno && body.c_apellidosmaterno && body.c_nombres && body.c_nombrescompleto &&
                body.c_tipodocumento && body.c_numerodocumento && body.c_direccion && body.c_paiscodigo && body.c_departamentocodigo && body.c_provinciacodigo &&
                body.c_distritocodigo && body.c_telefono1) {
                const cliente: Cliente = body;
                const conn = await connect();
                const data = await conn.query('INSERT INTO MA_CLIENTES SET ?', [cliente]);
                await conn.end();
                const parsedRes: ResultSetHeader = data[0] as ResultSetHeader;
                return res.status(200).json({ success: true, data: cliente, message: "Se registró el cliente con éxito." });
            } return res.status(503).json({message: "Parámetros incompletos. Favor de completar los campos requeridos." });
        } return res.status(503).json({message: "No se está enviando el usuario que realiza el registro." });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error";
        if(errorAux.errno === 1062) message = "Existe un cliente con esos datos.";
        return res.status(500).send({error: error, message: message});
    }
}

export async function updateCliente(req: Request, res: Response): Promise<Response> {
    try {
        //Obtener datos
        const body = req.body;
        const c_compania = body.c_compania;
        const n_cliente = body.n_cliente;
        body.d_ultimafechamodificacion = moment().format('YYYY-MM-DD HH:MM:ss');
        const cliente: Cliente = req.body;
        const conn = await connect();
        await conn.query('UPDATE MA_CLIENTES SET ? WHERE c_compania = ? AND n_cliente = ?', [cliente, c_compania, n_cliente]);
        await conn.end();
        return res.status(200).json({ data: {...cliente}, message: "Se actualizó el cliente con éxito"  });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error.";
        if(errorAux.errno === 1062) message = "Existe un cliente con esos datos";
        return res.status(500).send({error: error, message: message});
    }
}

export async function deleteCliente(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        const cliente: Cliente = body;
        if(cliente.c_compania && cliente.n_cliente ) {
            const conn = await connect();
            await conn.query('DELETE FROM MA_CLIENTES WHERE c_compania = ? AND n_cliente = ?', [cliente.c_compania,cliente.n_cliente]);
            await conn.end();
            return res.status(200).json({ message: "Se eliminó el cliente con éxito"  });
        }return res.status(200).json({ message: "Se debe enviar el código de la compañía y cliente"  });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error.";
        if(errorAux.errno === 1217) message = "No se puede eliminar el cliente debido a que tiene datos asociados";
        return res.status(500).send({error: error, message: message});
    }
}


export async function getClienteDinamico(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        body.c_compania = body.c_compania ? body.c_compania : null
        body.n_cliente = body.n_cliente ? body.n_cliente : '0'
        body.c_estado = body.c_estado ? body.c_estado : null
        body.c_nombrescompleto = body.c_nombrescompleto ? body.c_nombrescompleto : null
        body.c_tipodocumento = body.c_tipodocumento ? body.c_tipodocumento : null
        body.c_numerodocumento = body.c_numerodocumento ? body.c_numerodocumento : null
        if(body) {
            const conn = await connect();
            const [[rows,fields], response] = await conn.query(`CALL cliente_getList(?,?,?,?,?,?)`,[body.c_compania,body.n_cliente,body.c_estado, body.c_nombrescompleto,body.c_tipodocumento,body.c_numerodocumento]);
            await conn.end();
            const clientesRes = rows as [Cliente];
            if(!clientesRes[0]) {
                return res.status(200).json({data:[], message: "No se encontró clientes" });
            }
            return res.status(200).json({data:rows, message: "Se obtuvo clientes" });
        }return res.status(200).json({ message: "Se debe enviar algún dato para filtrar"  });
    } catch (error) {
        console.error(error)
        return res.status(500).send(error)
    }
}