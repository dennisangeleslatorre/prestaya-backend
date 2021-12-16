"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const compania_controller_1 = require("../controllers/compania.controller");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
router.get('/list', passport_1.default.authenticate('jwt', { session: false }), compania_controller_1.getCompania);
router.get('/listAll', passport_1.default.authenticate('jwt', { session: false }), compania_controller_1.getCompaniaAdmin);
router.post('/register', passport_1.default.authenticate('jwt', { session: false }), compania_controller_1.registerCompania);
router.post('/:c_compania/delete', passport_1.default.authenticate('jwt', { session: false }), compania_controller_1.deleteCompania);
router.get('/:c_compania/getCompaniaByCodigoCompania', passport_1.default.authenticate('jwt', { session: false }), compania_controller_1.getCompaniaByCodigoCompania);
router.put('/update', passport_1.default.authenticate('jwt', { session: false }), compania_controller_1.updateCompania);
exports.default = router;
//# sourceMappingURL=compania.routes.js.map