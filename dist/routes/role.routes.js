"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const role_controller_1 = require("../controllers/role.controller");
const router = (0, express_1.Router)();
router.get('/', role_controller_1.getRoles);
router.post('/register', role_controller_1.registerRole);
router.put('/update/:id', role_controller_1.updateRole);
router.get('/getRoleById/:id', role_controller_1.getRoleById);
exports.default = router;
//# sourceMappingURL=role.routes.js.map