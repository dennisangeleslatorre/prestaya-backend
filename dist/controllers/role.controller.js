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
exports.getRoleById = exports.updateRole = exports.registerRole = exports.getRoles = void 0;
const database_1 = require("../database");
function getRoles(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const conn = yield (0, database_1.connect)();
            const data = yield conn.query('SELECT * FROM role');
            const rolesRes = data[0];
            if (!rolesRes[0]) {
                return res.status(200).json({ succes: true, data: [], message: "No se encontró roles" });
            }
            return res.status(200).json({ data: data[0], message: "Se obtuvo registros" });
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
            body.status = 1;
            const role = body;
            const conn = yield (0, database_1.connect)();
            const data = yield conn.query('INSERT INTO role SET ?', [role]);
            const parsedRes = data[0];
            return res.status(200).json({ success: true, data: role, id: parsedRes.insertId, message: "Se registró el rol con éxito" });
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
            const role = req.body;
            const id = req.params.id;
            const conn = yield (0, database_1.connect)();
            const data = yield conn.query('UPDATE role SET ? WHERE id = ?', [role, id]);
            return res.status(200).json({ success: true, data: Object.assign(Object.assign({}, role), { id: parseInt(id) }), message: "Se actualizó el rol con éxito" });
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
exports.updateRole = updateRole;
function getRoleById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const conn = yield (0, database_1.connect)();
            const data = yield conn.query('SELECT * FROM role WHERE id = ?', [id]);
            const roleRes = data[0];
            if (!roleRes[0]) {
                return res.status(200).json({ succes: true, data: {}, message: "No se encontró el rol" });
            }
            return res.status(200).json({ succes: true, data: roleRes[0], message: "Se obtuvo el rol con éxito" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    });
}
exports.getRoleById = getRoleById;
//# sourceMappingURL=role.controller.js.map