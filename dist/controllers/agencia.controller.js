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
exports.registerAgencia = exports.getAgencia = void 0;
const database_1 = require("../database");
function getAgencia(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const conn = yield (0, database_1.connect)();
            const data = yield conn.query('SELECT * FROM MA_AGENCIA WHERE ?');
            yield conn.end();
            const agenciaRes = data[0];
            if (!agenciaRes[0]) {
                return res.status(200).json({ success: false, data: [], message: "No se encontró agencias." });
            }
            return res.status(200).json({ success: true, data: data[0], message: "Se obtuvo agencias." });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    });
}
exports.getAgencia = getAgencia;
/* ARREGLAR DE ACA */
function registerAgencia(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = req.body;
            if (body.c_codigousuario_r) {
                body.c_usuarioregistro = body.c_codigousuario_r;
                if (body.c_codigousuario_r && body.c_compania && body.c_agencia) {
                    const agencia = body;
                    const conn = yield (0, database_1.connect)();
                    const data = yield conn.query('INSERT INTO MA_AGENCIA SET ?', [agencia]);
                    yield conn.end();
                    const parsedRes = data[0];
                    return res.status(200).json({ success: true, data: agencia, message: "Se registró la agencia con éxito." });
                }
                return res.status(503).json({ message: "Completar los datos obligatorios." });
            }
            return res.status(503).json({ message: "No estas enviando el usuario que realiza el registro" });
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
//# sourceMappingURL=agencia.controller.js.map