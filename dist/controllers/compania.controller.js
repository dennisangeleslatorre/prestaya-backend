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
exports.updateCompania = exports.getCompaniaByCodigoCompania = exports.registerCompania = exports.getCompaniaAdmin = exports.getCompania = void 0;
const database_1 = require("../database");
const moment_1 = __importDefault(require("moment"));
function getCompania(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const conn = yield (0, database_1.connect)();
            const [rows, fields] = yield conn.query('SELECT c_compania,c_descripcion,c_ruc,c_direccion,c_paiscodigo,c_departamentocodigo,c_provinciacodigo,c_distritocodigo FROM  MA_COMPANIA where c_estado="A"');
            yield conn.end();
            const tipoCompaniaRes = rows;
            if (!tipoCompaniaRes[0]) {
                return res.status(200).json({ data: [], message: "No se encontró compañía" });
            }
            return res.status(200).json({ data: rows, message: "Se obtuvo registros" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    });
}
exports.getCompania = getCompania;
function getCompaniaAdmin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const conn = yield (0, database_1.connect)();
            const [rows, fields] = yield conn.query('SELECT * FROM MA_COMPANIA');
            yield conn.end();
            const TipoCompaniaRes = rows;
            if (!TipoCompaniaRes[0]) {
                return res.status(200).json({ data: [], message: "No se encontró compañía" });
            }
            return res.status(200).json({ data: rows, message: "Se obtuvo registros" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    });
}
exports.getCompaniaAdmin = getCompaniaAdmin;
function registerCompania(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = req.body;
            if (body.c_usuarioregistro) {
                body.c_ultimousuario = body.c_usuarioregistro;
                console.log("Cuerpo", body);
                if (body.c_compania && body.c_ruc && body.c_direccion && body.c_paiscodigo && body.c_departamentocodigo && body.c_provinciacodigo && body.c_distritocodigo) {
                    const compania = body;
                    const conn = yield (0, database_1.connect)();
                    const data = yield conn.query('INSERT INTO MA_COMPANIA SET ?', [compania]);
                    yield conn.end();
                    const parsedRes = data[0];
                    return res.status(200).json({ success: true, data: compania, message: "Se registró la compañía con éxito." });
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
                message = "Existe una compañía con esos datos.";
            return res.status(500).send({ error: error, message: message });
        }
    });
}
exports.registerCompania = registerCompania;
function getCompaniaByCodigoCompania(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const c_compania = req.params.c_codigocompania;
            const conn = yield (0, database_1.connect)();
            const [rows, fields] = yield conn.query('SELECT * FROM MA_COMPANIA WHERE c_compania = ?', [c_compania]);
            yield conn.end();
            const companiaRes = rows;
            if (!companiaRes[0]) {
                return res.status(200).json({ data: {}, message: "No se encontró la compañía." });
            }
            return res.status(200).json({ data: companiaRes[0], message: "Se obtuvo la compañia." });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    });
}
exports.getCompaniaByCodigoCompania = getCompaniaByCodigoCompania;
function updateCompania(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //Obtener datos
            const body = req.body;
            const c_compania = body.c_compania;
            body.d_ultimafechamodificacion = (0, moment_1.default)().format('YYYY-MM-DD HH:MM:ss');
            const compania = req.body;
            const conn = yield (0, database_1.connect)();
            yield conn.query('UPDATE MA_COMPANIA SET ? WHERE c_compania = ?', [compania, c_compania]);
            yield conn.end();
            return res.status(200).json({ data: Object.assign({}, compania), message: "Se actualizó la compañía con éxito" });
        }
        catch (error) {
            console.error(error);
            const errorAux = JSON.parse(JSON.stringify(error));
            let message = "Hubo un error.";
            if (errorAux.errno === 1062)
                message = "Existe una compañía con esos datos";
            return res.status(500).send({ error: error, message: message });
        }
    });
}
exports.updateCompania = updateCompania;
/*
export async function registerCompania(req: Request, res: Response): Promise<Response> {
    try {
        const body = req.body;
        body.d_fecharegistro = moment().format('YYYY-MM-DD HH:MM:ss');
        if(body.c_codigousuario) body.c_usuarioregistro = body.c_codigousuario;
        body.c_estado = "A";
        const compania: Compania = body;
        const conn = await connect();
        const data = await conn.query('INSERT INTO MA_COMPANIA SET ?', [compania]);
        await conn.end();
        const parsedRes: ResultSetHeader = data[0] as ResultSetHeader;
        return res.status(200).json({ success:true, data: compania, message: "Se registró la compañía con éxito" });
    } catch (error) {
        console.error(error);
        const errorAux = JSON.parse(JSON.stringify(error));
        let message = "";
        if(errorAux.errno === 1062) message = "Existe un rol con esos datos";
        return res.status(500).send({error: error, message: message});
    }
}

export async function getCompaniaByCCompania(req: Request, res: Response): Promise<Response> {
    try {
        const c_compania = req.params.c_compania;
        const conn = await connect();
        const data = await conn.query('SELECT * FROM MA_COMPANIA WHERE c_compania = ?', [c_compania]);
        await conn.end();
        const companiaRes = data[0] as [Compania];
        if(!companiaRes[0]) {
            return res.status(200).json({ success:false, data:{}, message: "No se encontró la compañía" });
        }
        return res.status(200).json({ success:true, data: companiaRes[0], message: "Se obtuvo la compañía con éxito" });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}*/ 
//# sourceMappingURL=compania.controller.js.map