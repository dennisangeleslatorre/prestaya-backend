"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const departamento_controller_1 = require("../controllers/departamento.controller");
const router = (0, express_1.Router)();
router.get('/list', departamento_controller_1.getDepartamentos);
router.get('/listAll', departamento_controller_1.getDepartamentosAdmin);
router.post('/register', departamento_controller_1.registerDepartamento);
//router.put('/update/:n_perfil', );
router.get('/:c_codigousuario/getDepartamentoByCodigoDepartamento', departamento_controller_1.getDepartamentoByCodigoDepartamento);
exports.default = router;
//# sourceMappingURL=departamento.routes.js.map