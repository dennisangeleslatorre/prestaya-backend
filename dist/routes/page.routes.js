"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const page_controller_1 = require("../controllers/page.controller");
const router = (0, express_1.Router)();
router.get('/', page_controller_1.listPages);
router.post('/register', page_controller_1.registerPage);
router.put('/update/:id', page_controller_1.updatePage);
router.get('/:id', page_controller_1.getPageById);
exports.default = router;
//# sourceMappingURL=page.routes.js.map