import { Router } from "express"
import { getUsers, registerUser, updateUser, getUserByCodigoUsuario, login, deleteUser, changePassword,getAgenciaXUsuario,assignAgentXUsers } from '../controllers/user.controller'
import passport from 'passport'

const router = Router();

router.get('/list',passport.authenticate('jwt', { session: false }), getUsers);
router.post('/register',passport.authenticate('jwt', { session: false }), registerUser);
router.post('/login', login);
router.put('/:c_codigousuario/update',passport.authenticate('jwt', { session: false }), updateUser);
router.get('/:c_codigousuario/getUserByCodigoUsuario',passport.authenticate('jwt', { session: false }), getUserByCodigoUsuario);
router.post('/:c_codigousuario/delete',passport.authenticate('jwt', { session: false }), deleteUser);
router.put('/:c_codigousuario/changePassword',passport.authenticate('jwt', { session: false }), changePassword);
router.post('/getAgenciaXUsuario', getAgenciaXUsuario);
router.post('/assignAgentXUsers', assignAgentXUsers);

export default router;