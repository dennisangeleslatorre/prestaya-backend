import { Router } from "express"
import { getRoles, registerRole, updateRole, getRoleByNPerfil } from '../controllers/role.controller'

const router = Router();

router.get('/list', getRoles);
router.post('/register', registerRole);
router.put('/:n_perfil/update', updateRole);
router.get('/:n_perfil/getRoleByNPerfil', getRoleByNPerfil);

export default router;