"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const agencia_controller_1 = require("../controllers/agencia.controller");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
router.post('/list', passport_1.default.authenticate('jwt', { session: false }), agencia_controller_1.getAgencia);
router.get('/listAll', passport_1.default.authenticate('jwt', { session: false }), agencia_controller_1.getAgenciaAdmin);
router.post('/register', passport_1.default.authenticate('jwt', { session: false }), agencia_controller_1.registerAgencia);
router.put('/update', passport_1.default.authenticate('jwt', { session: false }), agencia_controller_1.updateAgencia);
router.post('/delete', passport_1.default.authenticate('jwt', { session: false }), agencia_controller_1.deleteAgencia);
router.post('/getAgenciaByCodigoAgencia', passport_1.default.authenticate('jwt', { session: false }), agencia_controller_1.getAgenciaByCodigoAgencia);
exports.default = router;
//# sourceMappingURL=agencia.routes.js.map