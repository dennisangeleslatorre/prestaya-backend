"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const provincia_controller_1 = require("../controllers/provincia.controller");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
router.get('/list', passport_1.default.authenticate('jwt', { session: false }), provincia_controller_1.getProvincias);
router.get('/listAll', passport_1.default.authenticate('jwt', { session: false }), provincia_controller_1.getProvinciasAdmin);
router.post('/register', passport_1.default.authenticate('jwt', { session: false }), provincia_controller_1.registerProvincia);
router.put('/update', passport_1.default.authenticate('jwt', { session: false }), provincia_controller_1.updateProvincia);
router.post('/delete', passport_1.default.authenticate('jwt', { session: false }), provincia_controller_1.deleteProvincia);
router.post('/getProvinciaByCodigoProvincia', passport_1.default.authenticate('jwt', { session: false }), provincia_controller_1.getProvinciaByCodigoProvincia);
exports.default = router;
//# sourceMappingURL=provincia.routes.js.map