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
exports.getPageById = exports.updatePage = exports.registerPage = exports.listPages = void 0;
const database_1 = require("../database");
function listPages(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const conn = yield (0, database_1.connect)();
            const data = yield conn.query('SELECT * FROM page');
            return res.status(200).json({ succes: true, data: data[0], message: "Se obtuvieron las páginas con éxito" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    });
}
exports.listPages = listPages;
function registerPage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const page = req.body;
            const conn = yield (0, database_1.connect)();
            const data = yield conn.query('INSERT INTO page SET ?', [page]);
            const parsedRes = data[0];
            return res.status(200).json({ success: true, data: page, id: parsedRes.insertId, message: "Se registró la página con éxito" });
        }
        catch (error) {
            console.error(error);
            const errorAux = JSON.parse(JSON.stringify(error));
            let message = "";
            if (errorAux.errno === 1062)
                message = "Existe una página con esos datos";
            return res.status(500).send({ error: error, message: message });
        }
    });
}
exports.registerPage = registerPage;
function updatePage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const page = req.body;
            const id = req.params.id;
            const conn = yield (0, database_1.connect)();
            const data = yield conn.query('UPDATE page SET ? WHERE id = ?', [page, id]);
            return res.status(200).json({ success: true, data: Object.assign(Object.assign({}, page), { id: parseInt(id) }), message: "Se actualizó la página con éxito" });
        }
        catch (error) {
            console.error(error);
            const errorAux = JSON.parse(JSON.stringify(error));
            let message = "";
            if (errorAux.errno === 1062)
                message = "Existe una página con esos datos";
            return res.status(500).send({ error: error, message: message });
        }
    });
}
exports.updatePage = updatePage;
function getPageById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const conn = yield (0, database_1.connect)();
            const data = yield conn.query('SELECT * FROM page WHERE id = ?', [id]);
            const pageRes = data[0];
            if (!pageRes[0]) {
                return res.status(204).json({ succes: true, data: [], message: "No se encontró la página" });
            }
            return res.status(200).json({ succes: true, data: data[0], message: "Se obtuvo la página con éxito" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    });
}
exports.getPageById = getPageById;
//# sourceMappingURL=page.controller.js.map