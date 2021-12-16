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
exports.deleteTipoDocumento = exports.updateTipoDocumento = exports.getTipoDocumentoByCodigoTipoDocumento = exports.registerTipoDocumento = exports.getTiposDocumento = exports.getTiposDocumentoAdmin = void 0;
const database_1 = require("../database");
const moment_1 = __importDefault(require("moment"));
function getTiposDocumentoAdmin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const conn = yield (0, database_1.connect)();
            const [rows, fields] = yield conn.query('SELECT * FROM MA_TIPODOCUMENTO');
            yield conn.end();
            const TiposDocumentoRes = rows;
            if (!TiposDocumentoRes[0]) {
                return res.status(200).json({ data: [], message: "No se encontró tipos de documento" });
            }
            return res.status(200).json({ data: rows, message: "Se obtuvo registros" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    });
}
exports.getTiposDocumentoAdmin = getTiposDocumentoAdmin;
function getTiposDocumento(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const conn = yield (0, database_1.connect)();
            const [rows, fields] = yield conn.query('SELECT * FROM MA_TIPODOCUMENTO WHERE c_estado="A"');
            yield conn.end();
            const TiposDocumentoRes = rows;
            if (!TiposDocumentoRes[0]) {
                return res.status(200).json({ data: [], message: "No se encontró tipos de documento" });
            }
            return res.status(200).json({ data: rows, message: "Se obtuvo registros" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    });
}
exports.getTiposDocumento = getTiposDocumento;
function registerTipoDocumento(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = req.body;
            if (body.c_usuarioregistro) {
                body.c_ultimousuario = body.c_usuarioregistro;
                body.d_fecharegistro = (0, moment_1.default)().format('YYYY-MM-DD HH:MM:ss');
                if (body.c_tipodocumento && body.c_descripcion) {
                    const tipoDocumento = body;
                    const conn = yield (0, database_1.connect)();
                    const data = yield conn.query('INSERT INTO MA_TIPODOCUMENTO SET ?', [tipoDocumento]);
                    yield conn.end();
                    const parsedRes = data[0];
                    return res.status(200).json({ data: tipoDocumento, message: "Se registró el tipo de documento con éxito." });
                }
                return res.status(500).json({ message: "Parámetros incompletos. Favor de completar los campos requeridos." });
            }
            return res.status(500).json({ message: "No se está enviando el usuario que realiza el registro." });
        }
        catch (error) {
            console.error(error);
            const errorAux = JSON.parse(JSON.stringify(error));
            let message = "Hubo un error";
            if (errorAux.errno === 1062)
                message = "Existe un tipo de documento con esos datos";
            return res.status(500).send({ error: error, message: message });
        }
    });
}
exports.registerTipoDocumento = registerTipoDocumento;
function getTipoDocumentoByCodigoTipoDocumento(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const c_tipodocumento = req.params.c_tipodocumento;
            const conn = yield (0, database_1.connect)();
            const [rows, fields] = yield conn.query('SELECT * FROM MA_TIPODOCUMENTO WHERE c_tipodocumento = ?', [c_tipodocumento]);
            yield conn.end();
            const tipoDocumentoRes = rows;
            if (!tipoDocumentoRes[0]) {
                return res.status(500).json({ success: false, data: {}, message: "No se encontró el tipo de documento." });
            }
            return res.status(200).json({ success: true, data: tipoDocumentoRes[0], message: "Se obtuvo el tipo de documento con éxito." });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    });
}
exports.getTipoDocumentoByCodigoTipoDocumento = getTipoDocumentoByCodigoTipoDocumento;
function updateTipoDocumento(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //Obtener datos
            const c_tipodocumento = req.params.c_tipodocumento;
            const body = req.body;
            if (body.c_ultimousuario) {
                body.d_ultimafechamodificacion = (0, moment_1.default)().format('YYYY-MM-DD HH:MM:ss');
                const tipoDocumento = body;
                const conn = yield (0, database_1.connect)();
                const resp = yield conn.query('UPDATE MA_TIPODOCUMENTO SET ? WHERE c_tipodocumento = ?', [tipoDocumento, c_tipodocumento]);
                console.log("res", resp);
                yield conn.end();
                return res.status(200).json({ data: Object.assign({}, tipoDocumento), message: "Se actualizó el tipo de documento con éxito" });
            }
            return res.status(500).json({ message: "No se está enviando el usuario que realiza la actualización." });
        }
        catch (error) {
            console.error(error);
            const errorAux = JSON.parse(JSON.stringify(error));
            let message = "Hubo un error.";
            if (errorAux.errno === 1062)
                message = "Existe un tpo de documento con esos datos";
            return res.status(500).send({ error: error, message: message });
        }
    });
}
exports.updateTipoDocumento = updateTipoDocumento;
function deleteTipoDocumento(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const c_tipodocumento = req.params.c_tipodocumento;
            const conn = yield (0, database_1.connect)();
            yield conn.query('DELETE FROM MA_TIPODOCUMENTO WHERE c_tipodocumento = ?', [c_tipodocumento]);
            yield conn.end();
            return res.status(200).json({ message: "Se eliminó el tipo de documento con éxito" });
        }
        catch (error) {
            console.error(error);
            const errorAux = JSON.parse(JSON.stringify(error));
            let message = "Hubo un error.";
            if (errorAux.errno === 1217)
                message = "No se puede eliminar el tipo de documento debido a que tiene datos asociados";
            return res.status(500).send({ error: error, message: message });
        }
    });
}
exports.deleteTipoDocumento = deleteTipoDocumento;
//# sourceMappingURL=tipoDocumento.controller.js.map