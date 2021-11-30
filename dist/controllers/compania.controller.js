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
exports.getCompaniaByCCompania = exports.updateCompania = exports.registerCompania = exports.getCompanias = void 0;
const database_1 = require("../database");
const moment_1 = __importDefault(require("moment"));
function getCompanias(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const conn = yield (0, database_1.connect)();
            const data = yield conn.query('SELECT * FROM MA_COMPANIA');
            yield conn.end();
            const companiasRes = data[0];
            if (!companiasRes[0]) {
                return res.status(200).json({ success: false, data: [], message: "No se encontró datos" });
            }
            return res.status(200).json({ success: true, data: data[0], message: "Se obtuvo registros" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    });
}
exports.getCompanias = getCompanias;
function registerCompania(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = req.body;
            body.d_fecharegistro = (0, moment_1.default)().format('YYYY-MM-DD HH:MM:ss');
            if (body.c_codigousuario)
                body.c_usuarioregistro = body.c_codigousuario;
            body.c_estado = "A";
            const compania = body;
            const conn = yield (0, database_1.connect)();
            const data = yield conn.query('INSERT INTO MA_COMPANIA SET ?', [compania]);
            yield conn.end();
            const parsedRes = data[0];
            return res.status(200).json({ success: true, data: compania, message: "Se registró la compañía con éxito" });
        }
        catch (error) {
            console.error(error);
            const errorAux = JSON.parse(JSON.stringify(error));
            let message = "";
            if (errorAux.errno === 1062)
                message = "Existe un rol con esos datos";
            return res.status(500).send({ error: error, message: message });
        }
    });
}
exports.registerCompania = registerCompania;
function updateCompania(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //Obtener datos
            const c_compania = req.params.c_compania;
            const body = req.body;
            body.d_ultimafechamodificacion = (0, moment_1.default)().format('YYYY-MM-DD HH:MM:ss');
            if (body.c_codigousuario)
                body.c_ultimousuario = body.c_codigousuario;
            const compania = req.body;
            const conn = yield (0, database_1.connect)();
            yield conn.query('UPDATE MA_COMPANIA SET ? WHERE c_compania = ?', [compania, c_compania]);
            yield conn.end();
            return res.status(200).json({ success: true, data: Object.assign({}, compania), message: "Se actualizó la compañía con éxito" });
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
function getCompaniaByCCompania(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const c_compania = req.params.c_compania;
            const conn = yield (0, database_1.connect)();
            const data = yield conn.query('SELECT * FROM MA_COMPANIA WHERE c_compania = ?', [c_compania]);
            yield conn.end();
            const companiaRes = data[0];
            if (!companiaRes[0]) {
                return res.status(200).json({ success: false, data: {}, message: "No se encontró la compañía" });
            }
            return res.status(200).json({ success: true, data: companiaRes[0], message: "Se obtuvo la compañía con éxito" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    });
}
exports.getCompaniaByCCompania = getCompaniaByCCompania;
//# sourceMappingURL=compania.controller.js.map