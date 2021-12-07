"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const provincia_controller_1 = require("../controllers/provincia.controller");
const router = (0, express_1.Router)();
router.get('/list', provincia_controller_1.getProvincias);
router.get('/listAll', provincia_controller_1.getProvinciasAdmin);
router.post('/register', provincia_controller_1.registerProvincia);
//router.put('/update/:n_perfil', );
router.get('/getProvinciaByCodigoProvincia', provincia_controller_1.getProvinciaByCodigoProvincia);
exports.default = router;
//# sourceMappingURL=provincia.routes.js.map