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
exports.getUnidadMedidaByNPerfil = exports.updateUnidadMedida = exports.registerUnidadMedida = exports.getUnidadesMedida = exports.getUnidadesMedidaAdmin = void 0;
const database_1 = require("../database");
const moment_1 = __importDefault(require("moment"));
function getUnidadesMedidaAdmin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const conn = yield (0, database_1.connect)();
            const data = yield conn.query('SELECT * FROM MA_UNIDADMEDIDA');
            yield conn.end();
            const unidadesMedidaRes = data[0];
            if (!unidadesMedidaRes[0]) {
                return res.status(200).json({ data: [], message: "No se encontró unidades de medida" });
            }
            return res.status(200).json({ data: data[0], message: "Se obtuvo registros" });
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
            const data = yield conn.query('SELECT * FROM MA_UNIDADMEDIDA WHERE c_estado="A"');
            yield conn.end();
            const unidadesMedidaRes = data[0];
            if (!unidadesMedidaRes[0]) {
                return res.status(200).json({ data: [], message: "No se encontró unidades de medida" });
            }
            return res.status(200).json({ data: data[0], message: "Se obtuvo registros" });
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
            body.d_fecharegistro = (0, moment_1.default)().format('YYYY-MM-DD HH:MM:ss');
            if (body.c_codigousuario)
                body.c_usuarioregistro = body.c_codigousuario;
            body.c_estado = "A";
            const unidadMedida = body;
            const conn = yield (0, database_1.connect)();
            const data = yield conn.query('INSERT INTO MA_UNIDADMEDIDA SET ?', [unidadMedida]);
            yield conn.end();
            const parsedRes = data[0];
            return res.status(200).json({ data: unidadMedida, message: "Se registró la unidad de medida con éxito" });
        }
        catch (error) {
            console.error(error);
            const errorAux = JSON.parse(JSON.stringify(error));
            let message = "";
            if (errorAux.errno === 1062)
                message = "Existe una unidad de medida con esos datos";
            return res.status(500).send({ error: error, message: message });
        }
    });
}
exports.registerUnidadMedida = registerUnidadMedida;
function updateUnidadMedida(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //Obtener datos
            const c_unidadmedida = req.params.c_unidadmedida;
            const body = req.body;
            body.d_ultimafechamodificacion = (0, moment_1.default)().format('YYYY-MM-DD HH:MM:ss');
            if (body.c_codigousuario)
                body.c_ultimousuario = body.c_codigousuario;
            const unidadMedida = req.body;
            const conn = yield (0, database_1.connect)();
            yield conn.query('UPDATE MA_UNIDADMEDIDA SET ? WHERE c_unidadmedida = ?', [unidadMedida, c_unidadmedida]);
            yield conn.end();
            return res.status(200).json({ data: Object.assign({}, unidadMedida), message: "Se actualizó la unidad de medida con éxito" });
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
function getUnidadMedidaByNPerfil(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const c_unidadmedida = req.params.c_unidadmedida;
            const conn = yield (0, database_1.connect)();
            const data = yield conn.query('SELECT * FROM MA_UNIDADMEDIDA WHERE c_unidadmedida = ?', [c_unidadmedida]);
            yield conn.end();
            const unidadMedidaRes = data[0];
            if (!unidadMedidaRes[0]) {
                return res.status(200).json({ data: {}, message: "No se encontró la unidad de medida" });
            }
            return res.status(200).json({ data: unidadMedidaRes[0], message: "Se obtuvo la unidad de medida con éxito" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    });
}
exports.getUnidadMedidaByNPerfil = getUnidadMedidaByNPerfil;
//# sourceMappingURL=unidadMedida.controller.js.map