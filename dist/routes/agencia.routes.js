"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const agencia_controller_1 = require("../controllers/agencia.controller");
const router = (0, express_1.Router)();
router.get('/list', agencia_controller_1.getAgencia);
router.post('/register', agencia_controller_1.registerAgencia);
exports.default = router;
//# sourceMappingURL=agencia.routes.js.map