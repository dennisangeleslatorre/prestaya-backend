"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
router.get('/', user_controller_1.getUsers);
router.post('/register', user_controller_1.registerUser);
router.post('/login', user_controller_1.login);
router.put('/update/:id', user_controller_1.updateUser);
router.get('/getUserById/:id', user_controller_1.getUserById);
exports.default = router;
//# sourceMappingURL=user.routes.js.map