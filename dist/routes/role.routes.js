"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const role_controller_1 = require("../controllers/role.controller");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
router.get('/list', passport_1.default.authenticate('jwt', { session: false }), role_controller_1.getRoles);
router.get('/listActivateRoles', passport_1.default.authenticate('jwt', { session: false }), role_controller_1.getRolesActivos);
router.post('/register', passport_1.default.authenticate('jwt', { session: false }), role_controller_1.registerRole);
router.put('/:n_perfil/update', passport_1.default.authenticate('jwt', { session: false }), role_controller_1.updateRole);
router.get('/:n_perfil/getRoleByNPerfil', passport_1.default.authenticate('jwt', { session: false }), role_controller_1.getRoleByNPerfil);
router.post('/:n_perfil/delete', passport_1.default.authenticate('jwt', { session: false }), role_controller_1.deleteRole);
exports.default = router;
//# sourceMappingURL=role.routes.js.map