import { Router } from "express"
import { getRoles,getRolesActivos,registerRole, updateRole, getRoleByNPerfil } from '../controllers/role.controller'
import passport from 'passport'

const router = Router();

router.get('/list',passport.authenticate('jwt', { session: false }), getRoles);
router.get('/listActivateRoles',passport.authenticate('jwt', { session: false }), getRolesActivos);
router.post('/register',passport.authenticate('jwt', { session: false }), registerRole);
router.put('/:n_perfil/update',passport.authenticate('jwt', { session: false }), updateRole);
router.get('/:n_perfil/getRoleByNPerfil',passport.authenticate('jwt', { session: false }), getRoleByNPerfil);

export default router;