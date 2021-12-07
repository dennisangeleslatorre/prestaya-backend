"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const compania_controller_1 = require("../controllers/compania.controller");
const router = (0, express_1.Router)();
router.get('/list', compania_controller_1.getCompania);
router.get('/listAll', compania_controller_1.getCompaniaAdmin);
router.post('/register', compania_controller_1.registerCompania);
router.put('/update/:n_perfil');
exports.default = router;
//# sourceMappingURL=compania.routes.js.map