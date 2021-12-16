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
exports.deleteUnidadMedida = exports.updateUnidadMedida = exports.getUnidadMedidaByCodigoUnidadMedida = exports.registerUnidadMedida = exports.getUnidadesMedida = exports.getUnidadesMedidaAdmin = void 0;
const database_1 = require("../database");
const moment_1 = __importDefault(require("moment"));
function getUnidadesMedidaAdmin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const conn = yield (0, database_1.connect)();
            const [rows, fields] = yield conn.query('SELECT * FROM MA_UNIDADMEDIDA');
            yield conn.end();
            const unidadesMedidaRes = rows;
            if (!unidadesMedidaRes[0]) {
                return res.status(200).json({ data: [], message: "No se encontró unidades de medida" });
            }
            return res.status(200).json({ success: true, data: rows, message: "Se obtuvo registros" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    });
}
exports.getUnidadesMedidaAdmin = getUnidadesMedidaAdmin;
function getUnidadesMedida(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const conn = yield (0, database_1.connect)();
            const [rows, fields] = yield conn.query('SELECT * FROM MA_UNIDADMEDIDA WHERE c_estado="A"');
            yield conn.end();
            const unidadesMedidaRes = rows;
            if (!unidadesMedidaRes[0]) {
                return res.status(200).json({ data: [], message: "No se encontró unidades de medida" });
            }
            return res.status(200).json({ success: true, data: rows, message: "Se obtuvo registros" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    });
}
exports.getUnidadesMedida = getUnidadesMedida;
function registerUnidadMedida(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = req.body;
            if (body.c_usuarioregistro) {
                body.c_ultimousuario = body.c_usuarioregistro;
                body.d_fecharegistro = (0, moment_1.default)().format('YYYY-MM-DD HH:MM:ss');
                if (body.c_unidadmedida && body.c_descripcion) {
                    const unidadMedida = body;
                    const conn = yield (0, database_1.connect)();
                    const data = yield conn.query('INSERT INTO MA_UNIDADMEDIDA SET ?', [unidadMedida]);
                    yield conn.end();
                    const parsedRes = data[0];
                    return res.status(200).json({ data: unidadMedida, message: "Se registró la unidad de medida con éxito." });
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
                message = "Existe una unidad de medida con esos datos";
            return res.status(500).send({ error: error, message: message });
        }
    });
}
exports.registerUnidadMedida = registerUnidadMedida;
function getUnidadMedidaByCodigoUnidadMedida(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const c_unidadmedida = req.params.c_unidadmedida;
            const conn = yield (0, database_1.connect)();
            const [rows, fields] = yield conn.query('SELECT * FROM MA_UNIDADMEDIDA WHERE c_unidadmedida = ?', [c_unidadmedida]);
            yield conn.end();
            const unidadMedidaRes = rows;
            if (!unidadMedidaRes[0]) {
                return res.status(200).json({ success: false, data: {}, message: "No se encontró la unidad de medida." });
            }
            return res.status(200).json({ success: true, data: unidadMedidaRes[0], message: "Se obtuvo la unidad de medida con éxito." });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    });
}
exports.getUnidadMedidaByCodigoUnidadMedida = getUnidadMedidaByCodigoUnidadMedida;
function updateUnidadMedida(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //Obtener datos
            const c_unidadmedida = req.params.c_unidadmedida;
            const body = req.body;
            if (body.c_ultimousuario) {
                body.d_ultimafechamodificacion = (0, moment_1.default)().format('YYYY-MM-DD HH:MM:ss');
                const unidadMedida = req.body;
                const conn = yield (0, database_1.connect)();
                yield conn.query('UPDATE MA_UNIDADMEDIDA SET ? WHERE c_unidadmedida = ?', [unidadMedida, c_unidadmedida]);
                yield conn.end();
                return res.status(200).json({ data: Object.assign({}, unidadMedida), message: "Se actualizó la unidad de medida con éxito" });
            }
            return res.status(500).json({ message: "No se está enviando el usuario que realiza la actualización." });
        }
        catch (error) {
            console.error(error);
            const errorAux = JSON.parse(JSON.stringify(error));
            let message = "Hubo un error.";
            if (errorAux.errno === 1062)
                message = "Existe una unidad de medida con esos datos";
            return res.status(500).send({ error: error, message: message });
        }
    });
}
exports.updateUnidadMedida = updateUnidadMedida;
function deleteUnidadMedida(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const c_unidadmedida = req.params.c_unidadmedida;
            const conn = yield (0, database_1.connect)();
            yield conn.query('DELETE FROM MA_UNIDADMEDIDA WHERE c_unidadmedida = ?', [c_unidadmedida]);
            yield conn.end();
            return res.status(200).json({ message: "Se eliminó la undiad de medida con éxito" });
        }
        catch (error) {
            console.error(error);
            const errorAux = JSON.parse(JSON.stringify(error));
            let message = "Hubo un error.";
            if (errorAux.errno === 1217)
                message = "No se puede eliminar la unidad de medida debido a que tiene datos asociados";
            return res.status(500).send({ error: error, message: message });
        }
    });
}
exports.deleteUnidadMedida = deleteUnidadMedida;
//# sourceMappingURL=unidadMedida.controller.js.map