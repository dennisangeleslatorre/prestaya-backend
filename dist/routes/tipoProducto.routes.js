"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tipoProducto_controller_1 = require("../controllers/tipoProducto.controller");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
router.get('/list', passport_1.default.authenticate('jwt', { session: false }), tipoProducto_controller_1.getTipoProducto);
router.get('/listAll', passport_1.default.authenticate('jwt', { session: false }), tipoProducto_controller_1.getTipoProductoAdmin);
router.post('/register', passport_1.default.authenticate('jwt', { session: false }), tipoProducto_controller_1.registerTipoProducto);
router.put('/:c_tipoproducto/update', passport_1.default.authenticate('jwt', { session: false }), tipoProducto_controller_1.updateTipoProducto);
router.get('/:c_tipoproducto/getTipoProductoByCodigoTipoProducto', passport_1.default.authenticate('jwt', { session: false }), tipoProducto_controller_1.getTipoProductoByCodigoTipoProducto);
exports.default = router;
//# sourceMappingURL=tipoProducto.routes.js.map