"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tipoDocumento_controller_1 = require("../controllers/tipoDocumento.controller");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
router.get('/list', passport_1.default.authenticate('jwt', { session: false }), tipoDocumento_controller_1.getTiposDocumento);
router.get('/listAll', passport_1.default.authenticate('jwt', { session: false }), tipoDocumento_controller_1.getTiposDocumentoAdmin);
router.post('/register', passport_1.default.authenticate('jwt', { session: false }), tipoDocumento_controller_1.registerTipoDocumento);
router.put('/:c_tipodocumento/update', passport_1.default.authenticate('jwt', { session: false }), tipoDocumento_controller_1.updateTipoDocumento);
router.post('/:c_tipodocumento/delete', passport_1.default.authenticate('jwt', { session: false }), tipoDocumento_controller_1.deleteTipoDocumento);
router.get('/:c_tipodocumento/getTipoDocumentoByCodigoTipoDocumento', passport_1.default.authenticate('jwt', { session: false }), tipoDocumento_controller_1.getTipoDocumentoByCodigoTipoDocumento);
exports.default = router;
//# sourceMappingURL=tipoDocumento.routes.js.map