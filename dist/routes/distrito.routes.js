"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const distrito_controller_1 = require("../controllers/distrito.controller");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
router.get('/list', passport_1.default.authenticate('jwt', { session: false }), distrito_controller_1.getDistritos);
router.get('/listAll', passport_1.default.authenticate('jwt', { session: false }), distrito_controller_1.getDistritosAdmin);
router.post('/register', passport_1.default.authenticate('jwt', { session: false }), distrito_controller_1.registerDistrito);
router.put('/update', passport_1.default.authenticate('jwt', { session: false }), distrito_controller_1.updateDistrito);
router.post('/delete', passport_1.default.authenticate('jwt', { session: false }), distrito_controller_1.deleteDistrito);
router.post('/getDistritoByCodigoDistrito', passport_1.default.authenticate('jwt', { session: false }), distrito_controller_1.getDistritoByCodigoDistrito);
exports.default = router;
//# sourceMappingURL=distrito.routes.js.map