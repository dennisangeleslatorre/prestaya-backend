import { Router } from "express"
import { getRoles, registerRole, updateRole, getRoleById } from '../controllers/role.controller'

const router = Router();

router.get('/', getRoles);
router.post('/register', registerRole);
router.put('/update/:id', updateRole);
router.get('/getRoleById/:id', getRoleById);

export default router;