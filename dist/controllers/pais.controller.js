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
exports.getPaisByPaisCodigo = exports.updatePais = exports.registerPais = exports.getPaises = void 0;
const database_1 = require("../database");
const moment_1 = __importDefault(require("moment"));
function getPaises(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const conn = yield (0, database_1.connect)();
            const data = yield conn.query('SELECT * FROM MA_PAIS');
            yield conn.end();
            const paisesRes = data[0];
            if (!paisesRes[0]) {
                return res.status(200).json({ success: false, data: [], message: "No se encontró paises" });
            }
            return res.status(200).json({ success: true, data: data[0], message: "Se obtuvo registros" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    });
}
exports.getPaises = getPaises;
function registerPais(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = req.body;
            body.d_fecharegistro = (0, moment_1.default)().format('YYYY-MM-DD HH:MM:ss');
            if (body.c_codigousuario)
                body.c_usuarioregistro = body.c_codigousuario;
            body.c_estado = "A";
            const pais = body;
            const conn = yield (0, database_1.connect)();
            const data = yield conn.query('INSERT INTO MA_PAIS SET ?', [pais]);
            yield conn.end();
            const parsedRes = data[0];
            return res.status(200).json({ success: true, data: pais, message: "Se registró el pais con éxito" });
        }
        catch (error) {
            console.error(error);
            const errorAux = JSON.parse(JSON.stringify(error));
            let message = "";
            if (errorAux.errno === 1062)
                message = "Existe un pais con esos datos";
            return res.status(500).send({ error: error, message: message });
        }
    });
}
exports.registerPais = registerPais;
function updatePais(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //Obtener datos
            const c_paiscodigo = req.params.c_paiscodigo;
            const body = req.body;
            body.d_ultimafechamodificacion = (0, moment_1.default)().format('YYYY-MM-DD HH:MM:ss');
            if (body.c_codigousuario)
                body.c_ultimousuario = body.c_codigousuario;
            const pais = req.body;
            const conn = yield (0, database_1.connect)();
            yield conn.query('UPDATE MA_PAIS SET ? WHERE c_paiscodigo = ?', [pais, c_paiscodigo]);
            yield conn.end();
            return res.status(200).json({ success: true, data: Object.assign({}, pais), message: "Se actualizó el pais con éxito" });
        }
        catch (error) {
            console.error(error);
            const errorAux = JSON.parse(JSON.stringify(error));
            let message = "Hubo un error.";
            if (errorAux.errno === 1062)
                message = "Existe un pais con esos datos";
            return res.status(500).send({ error: error, message: message });
        }
    });
}
exports.updatePais = updatePais;
function getPaisByPaisCodigo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const c_paiscodigo = req.params.c_paiscodigo;
            const conn = yield (0, database_1.connect)();
            const data = yield conn.query('SELECT * FROM MA_PAIS WHERE c_paiscodigo = ?', [c_paiscodigo]);
            yield conn.end();
            const paisRes = data[0];
            if (!paisRes[0]) {
                return res.status(200).json({ success: false, data: {}, message: "No se encontró el pais" });
            }
            return res.status(200).json({ success: true, data: paisRes[0], message: "Se obtuvo el pais con éxito" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    });
}
exports.getPaisByPaisCodigo = getPaisByPaisCodigo;
//# sourceMappingURL=pais.controller.js.map