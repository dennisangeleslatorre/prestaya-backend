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
exports.registerPais = exports.getPaisesAdmin = exports.getPaises = void 0;
const database_1 = require("../database");
function getPaises(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const conn = yield (0, database_1.connect)();
            const [rows, fields] = yield conn.query('SELECT c_paiscodigo, c_descripcion FROM MA_PAIS where c_estado="A"');
            yield conn.end();
            const paisesRes = rows;
            if (!paisesRes[0]) {
                return res.status(200).json({ data: [], message: "No se encontró paises" });
            }
            return res.status(200).json({ data: rows, message: "Se obtuvo registros" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    });
}
exports.getPaises = getPaises;
function getPaisesAdmin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const conn = yield (0, database_1.connect)();
            const [rows, fields] = yield conn.query('SELECT * FROM MA_PAIS');
            yield conn.end();
            const paisesRes = rows;
            if (!paisesRes[0]) {
                return res.status(200).json({ data: [], message: "No se encontró paises" });
            }
            return res.status(200).json({ data: rows, message: "Se obtuvo registros" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    });
}
exports.getPaisesAdmin = getPaisesAdmin;
function registerPais(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = req.body;
            if (body.c_usuarioregistro) {
                body.c_ultimousuario = body.c_usuarioregistro;
                if (body.c_paiscodigo && body.c_descripcion) {
                    const pais = body;
                    const conn = yield (0, database_1.connect)();
                    const data = yield conn.query('INSERT INTO MA_PAIS SET ?', [pais]);
                    yield conn.end();
                    const parsedRes = data[0];
                    return res.status(200).json({ data: pais, message: "Se registró el pais con éxito." });
                }
                return res.status(200).json({ message: "Parámetros incompletos. Favor de completar los campos requeridos." });
            }
            return res.status(503).json({ message: "No se está enviando el usuario que realiza el registro." });
        }
        catch (error) {
            console.error(error);
            const errorAux = JSON.parse(JSON.stringify(error));
            let message = "Hubo un error";
            if (errorAux.errno === 1062)
                message = "Existe un pais con esos datos";
            return res.status(500).send({ error: error, message: message });
        }
    });
}
exports.registerPais = registerPais;
/*
export async function updatePais(req: Request, res: Response): Promise<Response> {
    try {
        //Obtener datos
        const c_paiscodigo = req.params.c_paiscodigo;
        const body = req.body
        body.d_ultimafechamodificacion = moment().format('YYYY-MM-DD HH:MM:ss');
        if(body.c_codigousuario) body.c_ultimousuario = body.c_codigousuario;
        const pais: Pais = req.body;
        const conn = await connect();
        await conn.query('UPDATE MA_PAIS SET ? WHERE c_paiscodigo = ?', [pais, c_paiscodigo]);
        await conn.end();
        return res.status(200).json({ success:true, data: {...pais}, message: "Se actualizó el pais con éxito"  });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "Hubo un error.";
        if(errorAux.errno === 1062) message = "Existe un pais con esos datos";
        return res.status(500).send({error: error, message: message});
    }
}

export async function getPaisByPaisCodigo(req: Request, res: Response): Promise<Response> {
    try {
        const c_paiscodigo = req.params.c_paiscodigo;
        const conn = await connect();
        const data = await conn.query('SELECT * FROM MA_PAIS WHERE c_paiscodigo = ?', [c_paiscodigo]);
        await conn.end();
        const paisRes = data[0] as [Pais];
        if(!paisRes[0]) {
            return res.status(200).json({ success:false, data:{}, message: "No se encontró el pais" });
        }
        return res.status(200).json({ success:true, data: paisRes[0], message: "Se obtuvo el pais con éxito" });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}*/ 
//# sourceMappingURL=pais.controller.js.map