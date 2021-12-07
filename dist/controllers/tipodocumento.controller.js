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
exports.getTipoDocumentoByNPerfil = exports.updateTipoDocumento = exports.registerTipoDocumento = exports.getTiposDocumento = exports.getTiposDocumentoAdmin = void 0;
const database_1 = require("../database");
const moment_1 = __importDefault(require("moment"));
function getTiposDocumentoAdmin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const conn = yield (0, database_1.connect)();
            const data = yield conn.query('SELECT * FROM MA_TIPODOCUMENTO');
            yield conn.end();
            const tIposDocumentoRes = data[0];
            if (!tIposDocumentoRes[0]) {
                return res.status(200).json({ data: [], message: "No se encontró tipos de documento" });
            }
            return res.status(200).json({ data: data[0], message: "Se obtuvo registros" });
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
            const data = yield conn.query('SELECT * FROM MA_TIPODOCUMENTO WHERE c_estado="A"');
            yield conn.end();
            const tIposDocumentoRes = data[0];
            if (!tIposDocumentoRes[0]) {
                return res.status(200).json({ data: [], message: "No se encontró tipos de documento" });
            }
            return res.status(200).json({ data: data[0], message: "Se obtuvo registros" });
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
            body.d_fecharegistro = (0, moment_1.default)().format('YYYY-MM-DD HH:MM:ss');
            if (body.c_codigousuario)
                body.c_usuarioregistro = body.c_codigousuario;
            body.c_estado = "A";
            const tIpoDocumento = body;
            const conn = yield (0, database_1.connect)();
            const data = yield conn.query('INSERT INTO MA_TIPODOCUMENTO SET ?', [tIpoDocumento]);
            yield conn.end();
            const parsedRes = data[0];
            return res.status(200).json({ data: tIpoDocumento, message: "Se registró el tipo de documento con éxito" });
        }
        catch (error) {
            console.error(error);
            const errorAux = JSON.parse(JSON.stringify(error));
            let message = "";
            if (errorAux.errno === 1062)
                message = "Existe un tipo de documento con esos datos";
            return res.status(500).send({ error: error, message: message });
        }
    });
}
exports.registerTipoDocumento = registerTipoDocumento;
function updateTipoDocumento(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //Obtener datos
            const c_tipodocumento = req.params.c_tipodocumento;
            const body = req.body;
            body.d_ultimafechamodificacion = (0, moment_1.default)().format('YYYY-MM-DD HH:MM:ss');
            if (body.c_codigousuario)
                body.c_ultimousuario = body.c_codigousuario;
            const tIpoDocumento = req.body;
            const conn = yield (0, database_1.connect)();
            yield conn.query('UPDATE MA_TIPODOCUMENTO SET ? WHERE c_tipodocumento = ?', [tIpoDocumento, c_tipodocumento]);
            yield conn.end();
            return res.status(200).json({ data: Object.assign({}, tIpoDocumento), message: "Se actualizó el tipo de documento con éxito" });
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
function getTipoDocumentoByNPerfil(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const c_tipodocumento = req.params.c_tipodocumento;
            const conn = yield (0, database_1.connect)();
            const data = yield conn.query('SELECT * FROM MA_TIPODOCUMENTO WHERE c_tipodocumento = ?', [c_tipodocumento]);
            yield conn.end();
            const tIpoDocumentoRes = data[0];
            if (!tIpoDocumentoRes[0]) {
                return res.status(200).json({ data: {}, message: "No se encontró el tipo de documento" });
            }
            return res.status(200).json({ data: tIpoDocumentoRes[0], message: "Se obtuvo el tipo de documento con éxito" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    });
}
exports.getTipoDocumentoByNPerfil = getTipoDocumentoByNPerfil;
//# sourceMappingURL=tipoDocumento.controller.js.map