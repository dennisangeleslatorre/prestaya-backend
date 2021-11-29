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
exports.getRoleByNPerfil = exports.updateRole = exports.registerRole = exports.getRoles = void 0;
const database_1 = require("../database");
const moment_1 = __importDefault(require("moment"));
function getRoles(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const conn = yield (0, database_1.connect)();
            const data = yield conn.query('SELECT * FROM MA_PERFIL');
            yield conn.end();
            const rolesRes = data[0];
            if (!rolesRes[0]) {
                return res.status(200).json({ success: false, data: [], message: "No se encontró roles" });
            }
            return res.status(200).json({ success: true, data: data[0], message: "Se obtuvo registros" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    });
}
exports.getRoles = getRoles;
function registerRole(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = req.body;
            body.d_fecharegistro = (0, moment_1.default)().format('YYYY-MM-DD HH:MM:ss');
            if (body.c_codigousuario)
                body.c_usuarioregistro = body.c_codigousuario;
            body.c_estado = "A";
            const role = body;
            const conn = yield (0, database_1.connect)();
            const data = yield conn.query('INSERT INTO MA_PERFIL SET ?', [role]);
            yield conn.end();
            const parsedRes = data[0];
            return res.status(200).json({ success: true, data: role, message: "Se registró el rol con éxito" });
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
exports.registerRole = registerRole;
function updateRole(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //Obtener datos
            const n_perfil = req.params.n_perfil;
            const body = req.body;
            body.d_ultimafechamodificacion = (0, moment_1.default)().format('YYYY-MM-DD HH:MM:ss');
            if (body.c_codigousuario)
                body.c_ultimousuario = body.c_codigousuario;
            const role = req.body;
            const conn = yield (0, database_1.connect)();
            yield conn.query('UPDATE MA_PERFIL SET ? WHERE n_perfil = ?', [role, n_perfil]);
            yield conn.end();
            return res.status(200).json({ success: true, data: Object.assign({}, role), message: "Se actualizó el rol con éxito" });
        }
        catch (error) {
            console.error(error);
            const errorAux = JSON.parse(JSON.stringify(error));
            let message = "Hubo un error.";
            if (errorAux.errno === 1062)
                message = "Existe un rol con esos datos";
            return res.status(500).send({ error: error, message: message });
        }
    });
}
exports.updateRole = updateRole;
function getRoleByNPerfil(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const n_perfil = req.params.n_perfil;
            const conn = yield (0, database_1.connect)();
            const data = yield conn.query('SELECT * FROM MA_PERFIL WHERE n_perfil = ?', [n_perfil]);
            yield conn.end();
            const roleRes = data[0];
            if (!roleRes[0]) {
                return res.status(200).json({ success: false, data: {}, message: "No se encontró el rol" });
            }
            return res.status(200).json({ success: true, data: roleRes[0], message: "Se obtuvo el rol con éxito" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    });
}
exports.getRoleByNPerfil = getRoleByNPerfil;
//# sourceMappingURL=role.controller.js.map