"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const departamento_controller_1 = require("../controllers/departamento.controller");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
router.get('/list', passport_1.default.authenticate('jwt', { session: false }), departamento_controller_1.getDepartamentos);
router.get('/listAll', passport_1.default.authenticate('jwt', { session: false }), departamento_controller_1.getDepartamentosAdmin);
router.post('/register', passport_1.default.authenticate('jwt', { session: false }), departamento_controller_1.registerDepartamento);
//router.put('/update/:n_perfil', );
router.post('/getDepartamentoByCodigoDepartamento', passport_1.default.authenticate('jwt', { session: false }), departamento_controller_1.getDepartamentoByCodigoDepartamento);
exports.default = router;
//# sourceMappingURL=departamento.routes.js.map