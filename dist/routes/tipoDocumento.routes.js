"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tipoDocumento_controller_1 = require("../controllers/tipoDocumento.controller");
const router = (0, express_1.Router)();
router.get('/list', tipoDocumento_controller_1.getTiposDocumento);
router.get('/listAll', tipoDocumento_controller_1.getTiposDocumentoAdmin);
router.post('/register', tipoDocumento_controller_1.registerTipoDocumento);
router.put('/:c_tipodocumento/update', tipoDocumento_controller_1.updateTipoDocumento);
router.get('/:c_tipodocumento/getTipoDocumentoByCodigoTipoDocumento', tipoDocumento_controller_1.getTipoDocumentoByCodigoTipoDocumento);
exports.default = router;
//# sourceMappingURL=tipoDocumento.routes.js.map