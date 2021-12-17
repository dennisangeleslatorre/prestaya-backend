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
exports.deleteAgencia = exports.updateAgencia = exports.getAgenciaByCodigoAgencia = exports.registerAgencia = exports.getAgenciaAdmin = exports.getAgencia = void 0;
const database_1 = require("../database");
const moment_1 = __importDefault(require("moment"));
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
            if (body.c_usuarioregistro) {
                body.c_ultimousuario = body.c_usuarioregistro;
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
                const [rows, fields] = yield conn.query('SELECT * FROM MA_AGENCIA where c_compania=? AND c_agencia=?', [agencia.c_compania, agencia.c_agencia]);
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
function updateAgencia(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //Obtener datos
            const body = req.body;
            const c_compania = body.c_compania;
            const c_agencia = body.c_agencia;
            body.d_ultimafechamodificacion = (0, moment_1.default)().format('YYYY-MM-DD HH:MM:ss');
            const agencia = req.body;
            const conn = yield (0, database_1.connect)();
            yield conn.query('UPDATE MA_AGENCIA SET ? WHERE c_compania = ? AND c_agencia = ?', [agencia, c_compania, c_agencia]);
            yield conn.end();
            return res.status(200).json({ data: Object.assign({}, agencia), message: "Se actualizó la agencia con éxito" });
        }
        catch (error) {
            console.error(error);
            const errorAux = JSON.parse(JSON.stringify(error));
            let message = "Hubo un error.";
            if (errorAux.errno === 1062)
                message = "Existe una agencia con esos datos";
            return res.status(500).send({ error: error, message: message });
        }
    });
}
exports.updateAgencia = updateAgencia;
function deleteAgencia(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = req.body;
            const agencia = body;
            if (agencia.c_compania && agencia.c_agencia) {
                const conn = yield (0, database_1.connect)();
                yield conn.query('DELETE FROM MA_AGENCIA WHERE c_compania = ? AND c_agencia = ?', [agencia.c_compania, agencia.c_agencia]);
                yield conn.end();
                return res.status(200).json({ message: "Se eliminó la agencia con éxito" });
            }
            return res.status(200).json({ message: "Se debe enviar el código de la compañía y agencia" });
        }
        catch (error) {
            console.error(error);
            const errorAux = JSON.parse(JSON.stringify(error));
            let message = "Hubo un error.";
            if (errorAux.errno === 1217)
                message = "No se puede eliminar la agencia debido a que tiene datos asociados";
            return res.status(500).send({ error: error, message: message });
        }
    });
}
exports.deleteAgencia = deleteAgencia;
//# sourceMappingURL=agencia.controller.js.map