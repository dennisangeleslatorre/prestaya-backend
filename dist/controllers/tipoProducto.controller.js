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
exports.registerTipoProducto = exports.getTipoProductoAdmin = exports.getTipoProducto = void 0;
const database_1 = require("../database");
function getTipoProducto(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const conn = yield (0, database_1.connect)();
            const [rows, fields] = yield conn.query('SELECT c_tipoproducto, c_descripcion FROM MA_TIPOPRODUCTO where c_estado="A"');
            yield conn.end();
            const tipoProductoRes = rows;
            if (!tipoProductoRes[0]) {
                return res.status(200).json({ data: [], message: "No se encontró tipo de producto" });
            }
            return res.status(200).json({ data: rows, message: "Se obtuvo registros" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    });
}
exports.getTipoProducto = getTipoProducto;
function getTipoProductoAdmin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const conn = yield (0, database_1.connect)();
            const [rows, fields] = yield conn.query('SELECT * FROM MA_TIPOPRODUCTO');
            yield conn.end();
            const TipoProductoRes = rows;
            if (!TipoProductoRes[0]) {
                return res.status(200).json({ data: [], message: "No se encontró tipos de producto" });
            }
            return res.status(200).json({ data: rows, message: "Se obtuvo registros" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    });
}
exports.getTipoProductoAdmin = getTipoProductoAdmin;
function registerTipoProducto(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = req.body;
            if (body.c_usuarioregistro) {
                body.c_ultimousuario = body.c_usuarioregistro;
                if (body.c_tipoproducto && body.c_descripcion) {
                    const tipoProducto = body;
                    const conn = yield (0, database_1.connect)();
                    const data = yield conn.query('INSERT INTO MA_TIPOPRODUCTO SET ?', [tipoProducto]);
                    yield conn.end();
                    const parsedRes = data[0];
                    return res.status(200).json({ data: tipoProducto, message: "Se registró el tipo de producto con éxito." });
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
                message = "Existe un tipo de producto con esos datos";
            return res.status(500).send({ error: error, message: message });
        }
    });
}
exports.registerTipoProducto = registerTipoProducto;
//# sourceMappingURL=tipoProducto.controller.js.map