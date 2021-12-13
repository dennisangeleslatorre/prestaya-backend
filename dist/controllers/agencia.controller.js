"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAgenciaByCodigoAgencia = exports.registerAgencia = exports.getAgenciaAdmin = exports.getAgencia = void 0;
const database_1 = require("../database");
function getAgencia(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = req.body;
            const agencia = body;
            if (agencia.c_compania) {
                const conn = yield (0, database_1.connect)();
                const [rows, fields] = yield conn.query('SELECT * FROM MA_AGENCIA where c_estado="A" AND c_compania=?', [agencia.c_compania]);
                yield conn.end();
                const agenciaRes = rows;
                if (!agenciaRes[0]) {
                    return res.status(200).json({ data: [], message: "No se encontró agencias" });
                }
                return res.status(200).json({ data: rows, message: "Se obtuvo registros" });
            }
            return res.status(200).json({ message: "Se debe enviar la compañía para listar los agencias" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    });
}
exports.getAgencia = getAgencia;
function getAgenciaAdmin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const conn = yield (0, database_1.connect)();
            const [rows, fields] = yield conn.query('SELECT * FROM MA_AGENCIA');
            yield conn.end();
            const agenciaRes = rows;
            if (!agenciaRes[0]) {
                return res.status(200).json({ success: false, data: [], message: "No se encontró agencias." });
            }
            return res.status(200).json({ success: true, data: rows, message: "Se obtuvo agencias." });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    });
}
exports.getAgenciaAdmin = getAgenciaAdmin;
/* ARREGLAR DE ACA */
function registerAgencia(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = req.body;
            if (body.c_codigousuario_r) {
                body.c_usuarioregistro = body.c_codigousuario_r;
                if (body.c_compania && body.c_agencia && body.c_descripcion) {
                    const agencia = body;
                    const conn = yield (0, database_1.connect)();
                    const data = yield conn.query('INSERT INTO MA_AGENCIA SET ?', [agencia]);
                    yield conn.end();
                    const parsedRes = data[0];
                    return res.status(200).json({ success: true, data: agencia, message: "Se registró la agencia con éxito." });
                }
                return res.status(503).json({ message: "Parámetros incompletos. Favor de completar los campos requeridos." });
            }
            return res.status(503).json({ message: "No se está enviando el usuario que realiza el registro." });
        }
        catch (error) {
            console.error(error);
            const errorAux = JSON.parse(JSON.stringify(error));
            let message = "Hubo un error";
            if (errorAux.errno === 1062)
                message = "Existe una agencia con esos datos.";
            return res.status(500).send({ error: error, message: message });
        }
    });
}
exports.registerAgencia = registerAgencia;
function getAgenciaByCodigoAgencia(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = req.body;
            const agencia = body;
            if (agencia.c_compania && agencia.c_agencia) {
                const conn = yield (0, database_1.connect)();
                const [rows, fields] = yield conn.query('SELECT * FROM MA_AGENCIA where c_estado="A" AND c_compania=? AND c_agencia=?', [agencia.c_compania, agencia.c_agencia]);
                yield conn.end();
                const agenciaRes = rows;
                if (!agenciaRes[0]) {
                    return res.status(200).json({ data: [], message: "No se encontró agencias" });
                }
                return res.status(200).json({ data: agenciaRes[0], message: "Se obtuvo registros" });
            }
            return res.status(200).json({ message: "Se debe enviar el código de compañía y agencia para listar la información de agencia" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    });
}
exports.getAgenciaByCodigoAgencia = getAgenciaByCodigoAgencia;
/*
export async function updateAgencia(req: Request, res: Response): Promise<Response> {
    try {
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

export async function getAgenciaByCodigoAgencia(req: Request, res: Response): Promise<Response> {
    try {
        const c_codigousuario = req.params.c_codigousuario;
        const conn = await connect();
        const data = await conn.query('SELECT * FROM MA_USUARIOS WHERE c_codigousuario = ?', [c_codigousuario]);
        await conn.end();
        const userRes = data[0] as [Agencia];
        if(!userRes[0]) {
            return res.status(200).json({ success: false, data:{}, message: "No se encontró el usuario." });
        }
        return res.status(200).json({ success: true, data: userRes[0], message: "Se obtuvo el usuario con éxito." });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}
*/ 
//# sourceMappingURL=agencia.controller.js.map