"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const unidadMedida_controller_1 = require("../controllers/unidadMedida.controller");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
router.get('/list', passport_1.default.authenticate('jwt', { session: false }), unidadMedida_controller_1.getUnidadesMedida);
router.get('/listAll', passport_1.default.authenticate('jwt', { session: false }), unidadMedida_controller_1.getUnidadesMedidaAdmin);
router.post('/register', passport_1.default.authenticate('jwt', { session: false }), unidadMedida_controller_1.registerUnidadMedida);
router.put('/:c_unidadmedida/update', passport_1.default.authenticate('jwt', { session: false }), unidadMedida_controller_1.updateUnidadMedida);
router.post('/:c_unidadmedida/delete', passport_1.default.authenticate('jwt', { session: false }), unidadMedida_controller_1.deleteUnidadMedida);
router.get('/:c_unidadmedida/getUnidadMedidaByCodigoUnidadMedida', passport_1.default.authenticate('jwt', { session: false }), unidadMedida_controller_1.getUnidadMedidaByCodigoUnidadMedida);
exports.default = router;
//# sourceMappingURL=unidadMedida.routes.js.map