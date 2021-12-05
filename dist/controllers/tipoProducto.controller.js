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
exports.getTipoProductoAdmin = exports.getTipoProducto = void 0;
const database_1 = require("../database");
function getTipoProducto(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const conn = yield (0, database_1.connect)();
            const [rows, fields] = yield conn.query('SELECT c_tipoproducto, c_descripcion FROM MA_TIPOPRODUCTO where c_estado="A"');
            yield conn.end();
            const tipoProductoRes = rows;
            if (!tipoProductoRes) {
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
            if (!TipoProductoRes) {
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
exports.getTipoProductoAdmin = getTipoProductoAdmin;
//# sourceMappingURL=tipoProducto.controller.js.map