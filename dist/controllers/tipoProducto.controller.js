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
exports.deleteTipoProducto = exports.getTipoProductoByCodigoTipoProducto = exports.updateTipoProducto = exports.registerTipoProducto = exports.getTipoProductoAdmin = exports.getTipoProducto = void 0;
const database_1 = require("../database");
const moment_1 = __importDefault(require("moment"));
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
                body.d_fecharegistro = (0, moment_1.default)().format('YYYY-MM-DD HH:MM:ss');
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
function updateTipoProducto(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //Obtener datos
            const c_tipoproducto = req.params.c_tipoproducto;
            const body = req.body;
            if (body.c_ultimousuario) {
                body.d_ultimafechamodificacion = (0, moment_1.default)().format('YYYY-MM-DD HH:MM:ss');
                const tipoProducto = body;
                const conn = yield (0, database_1.connect)();
                const resp = yield conn.query('UPDATE MA_TIPOPRODUCTO SET ? WHERE c_tipoproducto = ?', [tipoProducto, c_tipoproducto]);
                console.log("resp", resp);
                yield conn.end();
                return res.status(200).json({ message: "Se actualizó el tipo de documento con éxito" });
            }
            return res.status(500).json({ message: "No se está enviando el usuario que realiza la actualización." });
        }
        catch (error) {
            console.error(error);
            const errorAux = JSON.parse(JSON.stringify(error));
            let message = "Hubo un error.";
            if (errorAux.errno === 1062)
                message = "Existe un tipo de documento con esos datos";
            return res.status(500).send({ error: error, message: message });
        }
    });
}
exports.updateTipoProducto = updateTipoProducto;
function getTipoProductoByCodigoTipoProducto(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const c_tipoproducto = req.params.c_tipoproducto;
            const conn = yield (0, database_1.connect)();
            const [rows, fields] = yield conn.query('SELECT * FROM MA_TIPOPRODUCTO WHERE c_tipoproducto = ?', [c_tipoproducto]);
            yield conn.end();
            const tipoProductoRes = rows;
            if (!tipoProductoRes[0]) {
                return res.status(200).json({ success: false, data: {}, message: "No se encontró el tipo de producto." });
            }
            return res.status(200).json({ success: true, data: tipoProductoRes[0], message: "Se obtuvo el tipo de producto con éxito." });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    });
}
exports.getTipoProductoByCodigoTipoProducto = getTipoProductoByCodigoTipoProducto;
function deleteTipoProducto(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const c_tipoproducto = req.params.c_tipoproducto;
            const conn = yield (0, database_1.connect)();
            yield conn.query('DELETE FROM MA_TIPOPRODUCTO WHERE c_tipoproducto = ?', [c_tipoproducto]);
            yield conn.end();
            return res.status(200).json({ message: "Se eliminó el tipo de producto con éxito" });
        }
        catch (error) {
            console.error(error);
            const errorAux = JSON.parse(JSON.stringify(error));
            let message = "Hubo un error.";
            if (errorAux.errno === 1217)
                message = "No se puede eliminar el tipo de producto debido a que tiene datos asociados";
            return res.status(500).send({ error: error, message: message });
        }
    });
}
exports.deleteTipoProducto = deleteTipoProducto;
//# sourceMappingURL=tipoProducto.controller.js.map