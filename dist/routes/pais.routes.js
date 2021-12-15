"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pais_controller_1 = require("../controllers/pais.controller");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
router.get('/list', passport_1.default.authenticate('jwt', { session: false }), pais_controller_1.getPaises);
router.get('/listAll', passport_1.default.authenticate('jwt', { session: false }), pais_controller_1.getPaisesAdmin);
router.post('/register', passport_1.default.authenticate('jwt', { session: false }), pais_controller_1.registerPais);
router.put('/:c_paiscodigo/update', passport_1.default.authenticate('jwt', { session: false }), pais_controller_1.updatePais);
router.post('/:c_paiscodigo/delete', passport_1.default.authenticate('jwt', { session: false }), pais_controller_1.deletePais);
router.get('/:c_paiscodigo/getPaisByCodigoPais', passport_1.default.authenticate('jwt', { session: false }), pais_controller_1.getPaisByCodigoPais);
exports.default = router;
//# sourceMappingURL=pais.routes.js.map