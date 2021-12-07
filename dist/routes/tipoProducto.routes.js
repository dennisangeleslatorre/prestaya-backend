"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tipoProducto_controller_1 = require("../controllers/tipoProducto.controller");
const router = (0, express_1.Router)();
router.get('/list', tipoProducto_controller_1.getTipoProducto);
router.get('/listAll', tipoProducto_controller_1.getTipoProductoAdmin);
router.post('/register', tipoProducto_controller_1.registerTipoProducto);
router.put('/:c_tipoproducto/update', tipoProducto_controller_1.updateTipoProducto);
router.get('/:c_tipoproducto/getTipoProductoByCodigoTipoProducto', tipoProducto_controller_1.getTipoProductoByCodigoTipoProducto);
exports.default = router;
//# sourceMappingURL=tipoProducto.routes.js.map