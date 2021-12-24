"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
router.get('/list', passport_1.default.authenticate('jwt', { session: false }), user_controller_1.getUsers);
router.post('/register', passport_1.default.authenticate('jwt', { session: false }), user_controller_1.registerUser);
router.post('/login', user_controller_1.login);
router.put('/:c_codigousuario/update', passport_1.default.authenticate('jwt', { session: false }), user_controller_1.updateUser);
router.get('/:c_codigousuario/getUserByCodigoUsuario', passport_1.default.authenticate('jwt', { session: false }), user_controller_1.getUserByCodigoUsuario);
router.post('/:c_codigousuario/delete', passport_1.default.authenticate('jwt', { session: false }), user_controller_1.deleteUser);
exports.default = router;
//# sourceMappingURL=user.routes.js.map