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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProvincia = exports.updateProvincia = exports.getProvinciaByCodigoProvincia = exports.registerProvincia = exports.getProvinciasAdmin = exports.getProvincias = void 0;
const database_1 = require("../database");
const moment_1 = __importDefault(require("moment"));
function getProvincias(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = req.body;
            const provincia = body;
            const conn = yield (0, database_1.connect)();
            const [rows, fields] = yield conn.query('SELECT c_paiscodigo,c_departamentocodigo,c_provinciacodigo,c_descripcion FROM MA_PROVINCIA where c_estado="A"');
            yield conn.end();
            const ProvinciasRes = rows;
            if (!ProvinciasRes[0]) {
                return res.status(200).json({ data: [], message: "No se encontró Provincias" });
            }
            return res.status(200).json({ data: rows, message: "Se obtuvo registros" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    });
}
exports.getProvincias = getProvincias;
function getProvinciasAdmin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const conn = yield (0, database_1.connect)();
            const [rows, fields] = yield conn.query('SELECT * FROM MA_PROVINCIA');
            yield conn.end();
            const provinciaRes = rows;
            if (!provinciaRes[0]) {
                return res.status(200).json({ data: [], message: "No se encontró provincia" });
            }
            return res.status(200).json({ data: rows, message: "Se obtuvo registros" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    });
}
exports.getProvinciasAdmin = getProvinciasAdmin;
function registerProvincia(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = req.body;
            if (body.c_usuarioregistro) {
                body.c_ultimousuario = body.c_usuarioregistro;
                if (body.c_paiscodigo && body.c_departamentocodigo && body.c_provinciacodigo && body.c_descripcion) {
                    const provincia = body;
                    const conn = yield (0, database_1.connect)();
                    const data = yield conn.query('INSERT INTO MA_PROVINCIA SET ?', [provincia]);
                    yield conn.end();
                    const parsedRes = data[0];
                    return res.status(200).json({ success: true, data: provincia, message: "Se registró el provincia con éxito" });
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
                message = "Existe un provincia con esos datos";
            return res.status(500).send({ error: error, message: message });
        }
    });
}
exports.registerProvincia = registerProvincia;
function getProvinciaByCodigoProvincia(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = req.body;
            const provincia = body;
            if (provincia.c_paiscodigo && provincia.c_departamentocodigo && provincia.c_provinciacodigo) {
                const conn = yield (0, database_1.connect)();
                const [rows, fields] = yield conn.query('SELECT * FROM MA_PROVINCIA where c_paiscodigo=? AND c_departamentocodigo=? AND c_provinciacodigo=?', [provincia.c_paiscodigo, provincia.c_departamentocodigo, provincia.c_provinciacodigo]);
                yield conn.end();
                const ProvinciasRes = rows;
                if (!ProvinciasRes[0]) {
                    return res.status(200).json({ data: [], message: "No se encontró Provincia" });
                }
                return res.status(200).json({ data: ProvinciasRes[0], message: "Se obtuvo registros" });
            }
            return res.status(200).json({ message: "Se debe enviar el código de pais, departamento y provincia para obtener los datos de la provincia" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    });
}
exports.getProvinciaByCodigoProvincia = getProvinciaByCodigoProvincia;
function updateProvincia(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //Obtener datos
            const body = req.body;
            const c_paiscodigo = body.c_paiscodigo;
            const c_departamentocodigo = body.c_departamentocodigo;
            const c_provinciacodigo = body.c_provinciacodigo;
            body.d_ultimafechamodificacion = (0, moment_1.default)().format('YYYY-MM-DD HH:MM:ss');
            const Provincia = req.body;
            const conn = yield (0, database_1.connect)();
            yield conn.query('UPDATE MA_PROVINCIA SET ? WHERE c_paiscodigo = ? AND c_departamentocodigo = ? AND c_provinciacodigo = ?', [Provincia, c_paiscodigo, c_departamentocodigo, c_provinciacodigo]);
            yield conn.end();
            return res.status(200).json({ data: Object.assign({}, Provincia), message: "Se actualizó la provincia con éxito" });
        }
        catch (error) {
            console.error(error);
            const errorAux = JSON.parse(JSON.stringify(error));
            let message = "Hubo un error.";
            if (errorAux.errno === 1062)
                message = "Existe una provincia con esos datos";
            return res.status(500).send({ error: error, message: message });
        }
    });
}
exports.updateProvincia = updateProvincia;
function deleteProvincia(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = req.body;
            const provincia = body;
            if (provincia.c_paiscodigo && provincia.c_departamentocodigo && provincia.c_provinciacodigo) {
                const conn = yield (0, database_1.connect)();
                yield conn.query('DELETE FROM MA_PROVINCIA WHERE c_paiscodigo = ? AND c_departamentocodigo = ? AND c_provinciacodigo = ?', [provincia.c_paiscodigo, provincia.c_departamentocodigo, provincia.c_provinciacodigo]);
                yield conn.end();
                return res.status(200).json({ message: "Se eliminó la provincia con éxito" });
            }
            return res.status(200).json({ message: "Se debe enviar el código del país, departamento y provincia" });
        }
        catch (error) {
            console.error(error);
            const errorAux = JSON.parse(JSON.stringify(error));
            let message = "Hubo un error.";
            if (errorAux.errno === 1217)
                message = "No se puede eliminar la provincia debido a que tiene distritos asociados";
            return res.status(500).send({ error: error, message: message });
        }
    });
}
exports.deleteProvincia = deleteProvincia;
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
//# sourceMappingURL=provincia.controller.js.map