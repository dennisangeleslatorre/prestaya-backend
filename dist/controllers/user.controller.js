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
exports.deleteUser = exports.login = exports.getByUsername = exports.getUserByCodigoUsuario = exports.updateUser = exports.registerUser = exports.getUsers = void 0;
const database_1 = require("../database");
const moment_1 = __importDefault(require("moment"));
const bcrypt = __importStar(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function getUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const conn = yield (0, database_1.connect)();
            const data = yield conn.query('SELECT c_codigousuario,c_nombres,c_correo,c_telefono,A.c_estado as c_estado_usuario,B.n_perfil,c_codigoperfil,c_paginas,c_botones,B.c_estado AS c_estado_perfil FROM MA_USUARIOS A JOIN MA_PERFIL B ON A.n_perfil=B.n_perfil');
            yield conn.end();
            const userRes = data[0];
            if (!userRes[0]) {
                return res.status(200).json({ success: false, data: [], message: "No se encontró usuarios." });
            }
            return res.status(200).json({ success: true, data: data[0], message: "Se obtuvo usuarios." });
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
            if (body.c_usuarioregistro) {
                body.d_fecharegistro = (0, moment_1.default)().format('YYYY-MM-DD HH:MM:ss');
                body.c_clave = bcrypt.hashSync(body.c_clave, 10);
                const user = body;
                const conn = yield (0, database_1.connect)();
                const data = yield conn.query('INSERT INTO MA_USUARIOS SET ?', [user]);
                yield conn.end();
                const parsedRes = data[0];
                return res.status(200).json({ success: true, data: user, message: "Se registró el usuario con éxito." });
            }
            return res.status(500).json({ message: "No se está enviando el usuario que realiza el registro." });
        }
        catch (error) {
            console.error(error);
            const errorAux = JSON.parse(JSON.stringify(error));
            let message = "Hubo un error";
            if (errorAux.errno === 1062)
                message = "Existe un usuario con esos datos.";
            return res.status(500).send({ error: error, message: message });
        }
    });
}
exports.registerUser = registerUser;
function updateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const c_codigousuario = req.params.c_codigousuario;
            const body = req.body;
            if (body.c_ultimousuario) {
                body.d_ultimafechamodificacion = (0, moment_1.default)().format('YYYY-MM-DD HH:MM:ss'); //AGREGAR UN CAMPO AL BODY
                if (body.c_clave != undefined) {
                    body.c_clave = bcrypt.hashSync(body.c_clave, 10);
                }
                const user = body;
                const conn = yield (0, database_1.connect)();
                yield conn.query('UPDATE MA_USUARIOS SET ? WHERE c_codigousuario = ?', [user, c_codigousuario]);
                yield conn.end();
                return res.status(200).json({ success: true, data: Object.assign(Object.assign({}, user), { message: "Se actualizó el usuario con éxito." }) });
            }
            return res.status(500).json({ message: "No se está enviando el usuario que realiza la actualización." });
        }
        catch (error) {
            console.error(error);
            const errorAux = JSON.parse(JSON.stringify(error));
            let message = "";
            if (errorAux.errno === 1062)
                message = "Existe un usuario con esos datos.";
            return res.status(500).send({ error: error, message: message });
        }
    });
}
exports.updateUser = updateUser;
function getUserByCodigoUsuario(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const c_codigousuario = req.params.c_codigousuario;
            const conn = yield (0, database_1.connect)();
            const data = yield conn.query('SELECT * FROM MA_USUARIOS WHERE c_codigousuario = ?', [c_codigousuario]);
            yield conn.end();
            const userRes = data[0];
            if (!userRes[0]) {
                return res.status(200).json({ success: false, data: {}, message: "No se encontró el usuario." });
            }
            return res.status(200).json({ success: true, data: userRes[0], message: "Se obtuvo el usuario con éxito." });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    });
}
exports.getUserByCodigoUsuario = getUserByCodigoUsuario;
function getByUsername(c_codigousuario) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const conn = yield (0, database_1.connect)();
            const res = yield conn.query('SELECT u.c_nombres, u.c_codigousuario, u.c_estado, u.c_clave, r.c_codigoperfil, r.c_paginas, r.c_botones FROM MA_USUARIOS u INNER JOIN MA_PERFIL r on u.n_perfil = r.n_perfil WHERE u.c_codigousuario = ?', c_codigousuario);
            yield conn.end();
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
        const secret = "PrestaYA";
        try {
            const { c_codigousuario, c_clave } = req.body;
            const userRes = yield getByUsername(c_codigousuario);
            const user = userRes.data;
            if (!user.length)
                return res.status(200).json({ success: false, message: "Usuario no registrado." });
            if (user[0].c_estado !== "A")
                return res.status(200).json({ success: false, message: "El usuario no está activo." });
            if (user[0] != undefined && user[0].c_clave && bcrypt.compareSync(c_clave, user[0].c_clave)) {
                delete user[0].c_clave;
                user[0].a_paginas = user[0].c_paginas.split(",");
                const payload = {
                    sub: user[0].c_codigousuario
                };
                const token = jsonwebtoken_1.default.sign(payload, secret);
                return res.status(200).json({ success: true, data: user[0], message: "Login con éxito", token: token });
            }
            else {
                return res.status(200).json({ success: false, message: "Usuario y/o contraseña incorrectos." });
            }
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: error, message: "Hubo un error." });
        }
    });
}
exports.login = login;
function deleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const c_codigousuario = req.params.c_codigousuario;
            if (c_codigousuario) {
                const conn = yield (0, database_1.connect)();
                yield conn.query('DELETE FROM MA_USUARIOS WHERE c_codigousuario = ?', [c_codigousuario]);
                yield conn.end();
                return res.status(200).json({ message: "Se actualizó el usuario con éxito." });
            }
            return res.status(500).json({ message: "No se está enviando el código para la eliminación." });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: error, message: "Hubo un error." });
        }
    });
}
exports.deleteUser = deleteUser;
//# sourceMappingURL=user.controller.js.map