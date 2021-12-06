"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const distrito_controller_1 = require("../controllers/distrito.controller");
const router = (0, express_1.Router)();
router.get('/list', distrito_controller_1.getDistritos);
router.get('/listAll', distrito_controller_1.getDistritosAdmin);
router.post('/register', distrito_controller_1.registerDistrito);
//router.put('/update/:n_perfil', );
exports.default = router;
//# sourceMappingURL=distrito.routes.js.map