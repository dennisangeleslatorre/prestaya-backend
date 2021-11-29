"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
router.get('/list', user_controller_1.getUsers);
router.post('/register', user_controller_1.registerUser);
router.post('/login', user_controller_1.login);
router.put('/update/:c_codigousuario', user_controller_1.updateUser);
router.get('/getUserByCodigoUsuario/:c_codigousuario', user_controller_1.getUserByCodigoUsuario);
exports.default = router;
//# sourceMappingURL=user.routes.js.map