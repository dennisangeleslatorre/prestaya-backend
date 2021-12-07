"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const unidadMedida_controller_1 = require("../controllers/unidadMedida.controller");
const router = (0, express_1.Router)();
router.get('/list', unidadMedida_controller_1.getUnidadesMedida);
router.get('/listAll', unidadMedida_controller_1.getUnidadesMedidaAdmin);
router.post('/register', unidadMedida_controller_1.registerUnidadMedida);
router.put('/update/:n_perfil');
router.post('/:c_unidadmedida/getUnidadMedidaByCodigoUnidadMedida', unidadMedida_controller_1.getUnidadMedidaByCodigoUnidadMedida);
exports.default = router;
//# sourceMappingURL=unidadMedida.routes.js.map