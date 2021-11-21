"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.login = exports.getByUsername = exports.getUserById = exports.updateUser = exports.registerUser = exports.getUsers = void 0;
const database_1 = require("../database");
const moment_1 = __importDefault(require("moment"));
const bcrypt = __importStar(require("bcrypt"));
function getUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const conn = yield (0, database_1.connect)();
            const data = yield conn.query('SELECT * FROM user');
            const userRes = data[0];
            if (!userRes[0]) {
                return res.status(200).json({ succes: true, data: [], message: "No se encontró usuarios" });
            }
            return res.status(200).json({ data: data[0], message: "Se obtuvo usuarios" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    });
}
exports.getUsers = getUsers;
function registerUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = req.body;
            body.status = 1;
            body.created_at = (0, moment_1.default)().format('YYYY-MM-DD HH:MM:SS');
            body.password = bcrypt.hashSync(body.password, 10);
            const user = body;
            const conn = yield (0, database_1.connect)();
            const data = yield conn.query('INSERT INTO user SET ?', [user]);
            const parsedRes = data[0];
            return res.status(200).json({ success: true, data: user, id: parsedRes.insertId, message: "Se registró el usuario con éxito" });
        }
        catch (error) {
            console.error(error);
            const errorAux = JSON.parse(JSON.stringify(error));
            let message = "Hubo un error";
            if (errorAux.errno === 1062)
                message = "Existe un usuario con esos datos";
            return res.status(500).send({ error: error, message: message });
        }
    });
}
exports.registerUser = registerUser;
function updateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = req.body;
            body.updated_at = (0, moment_1.default)().format('YYYY-MM-DD HH:MM:SS');
            if (body.password != undefined) {
                body.password = bcrypt.hashSync(body.password, 10);
            }
            const user = body;
            const id = req.params.id;
            const conn = yield (0, database_1.connect)();
            const data = yield conn.query('UPDATE user SET ? WHERE id = ?', [user, id]);
            return res.status(200).json({ success: true, data: Object.assign(Object.assign({}, user), { id: parseInt(id) }), message: "Se actualizó el usuario con éxito" });
        }
        catch (error) {
            console.error(error);
            const errorAux = JSON.parse(JSON.stringify(error));
            let message = "";
            if (errorAux.errno === 1062)
                message = "Existe un usuario con esos datos";
            return res.status(500).send({ error: error, message: message });
        }
    });
}
exports.updateUser = updateUser;
function getUserById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const conn = yield (0, database_1.connect)();
            const data = yield conn.query('SELECT * FROM user WHERE id = ?', [id]);
            const userRes = data[0];
            if (!userRes[0]) {
                return res.status(200).json({ succes: true, data: {}, message: "No se encontró el usuario" });
            }
            return res.status(200).json({ succes: true, data: userRes[0], message: "Se obtuvo el usuario con éxito" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    });
}
exports.getUserById = getUserById;
function getByUsername(username) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const conn = yield (0, database_1.connect)();
            const res = yield conn.query('SELECT * FROM user u INNER JOIN role r on u.role_id = r.id WHERE u.username = ?', username);
            return Promise.resolve({ success: true, data: res[0] });
        }
        catch (error) {
            console.error(error);
            return Promise.reject({ success: false, error });
        }
    });
}
exports.getByUsername = getByUsername;
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { username, password } = req.body;
            const userRes = yield getByUsername(username);
            const user = userRes.data;
            if (user[0] != undefined && user[0].password && bcrypt.compareSync(password, user[0].password)) {
                delete user[0].password;
                return res.status(200).json({ succes: true, data: user[0], message: "Login con éxito" });
            }
            else {
                return res.status(400).json({ success: false, message: "Usuario o contraseña incorrectos." });
            }
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: error, message: "Hubo un error." });
        }
    });
}
exports.login = login;
//# sourceMappingURL=user.controller.js.map