"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tipoProducto_controller_1 = require("../controllers/tipoProducto.controller");
const router = (0, express_1.Router)();
router.get('/list', tipoProducto_controller_1.getTipoProducto);
router.get('/listAdmin', tipoProducto_controller_1.getTipoProductoAdmin);
/*
router.post('/register', );
router.put('/update/:n_perfil', );
*/
exports.default = router;
//# sourceMappingURL=tipoProducto.routes.js.map