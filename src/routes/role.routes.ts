import { Router } from "express"
import { getRoles, registerRole, updateRole, getRoleByNPerfil } from '../controllers/role.controller'

const router = Router();

router.get('/list', getRoles);
router.post('/register', registerRole);
router.put('/update/:n_perfil', updateRole);
router.get('/getRoleByNPerfil/:n_perfil', getRoleByNPerfil);

export default router;