"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const parametros_controller_1 = require("../controllers/parametros.controller");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
router.get('/:c_codigocompania/list', passport_1.default.authenticate('jwt', { session: false }), parametros_controller_1.getParametros);
router.get('/listAll', passport_1.default.authenticate('jwt', { session: false }), parametros_controller_1.getParametrosAdmin);
router.post('/register', passport_1.default.authenticate('jwt', { session: false }), parametros_controller_1.registerParametros);
router.put('/update/:n_perfil');
router.post('/getParametrosByCodigoParametros', passport_1.default.authenticate('jwt', { session: false }), parametros_controller_1.getParametrosByCodigoParametros);
exports.default = router;
//# sourceMappingURL=parametros.routes.js.map