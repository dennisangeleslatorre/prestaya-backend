"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pais_controller_1 = require("../controllers/pais.controller");
const router = (0, express_1.Router)();
router.get('/list', pais_controller_1.getPaises);
router.get('/listAll', pais_controller_1.getPaisesAdmin);
router.post('/register', pais_controller_1.registerPais);
router.put('/:c_paiscodigo/update', pais_controller_1.updatePais);
router.get('/:c_codigopais/getPaisByCodigoPais', pais_controller_1.getPaisByCodigoPais);
exports.default = router;
//# sourceMappingURL=pais.routes.js.map