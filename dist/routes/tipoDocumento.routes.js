"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tipoDocumento_controller_1 = require("../controllers/tipoDocumento.controller");
const router = (0, express_1.Router)();
router.get('/list', tipoDocumento_controller_1.getTiposDocumento);
router.get('/listAll', tipoDocumento_controller_1.getTiposDocumentoAdmin);
router.post('/register');
router.put('/update/:n_perfil');
exports.default = router;
//# sourceMappingURL=tipoDocumento.routes.js.map