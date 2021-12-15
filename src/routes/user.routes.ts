import { Router } from "express"
import { getUsers, registerUser, updateUser, getUserByCodigoUsuario, login, deleteUser } from '../controllers/user.controller'
import passport from 'passport'

const router = Router();

router.get('/list',passport.authenticate('jwt', { session: false }), getUsers);
router.post('/register',passport.authenticate('jwt', { session: false }), registerUser);
router.post('/login', login);
router.put('/:c_codigousuario/update',passport.authenticate('jwt', { session: false }), updateUser);
router.get('/:c_codigousuario/getUserByCodigoUsuario',passport.authenticate('jwt', { session: false }), getUserByCodigoUsuario);
router.delete('/:c_codigousuario/delete',passport.authenticate('jwt', { session: false }), deleteUser);

export default router;