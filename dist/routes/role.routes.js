"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const role_controller_1 = require("../controllers/role.controller");
const router = (0, express_1.Router)();
router.get('/list', role_controller_1.getRoles);
router.post('/register', role_controller_1.registerRole);
router.put('/:n_perfil/update', role_controller_1.updateRole);
router.get('/:n_perfil/getRoleByNPerfil', role_controller_1.getRoleByNPerfil);
exports.default = router;
//# sourceMappingURL=role.routes.js.map