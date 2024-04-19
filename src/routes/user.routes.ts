import { Router } from "express"
import { getUsers, registerUser, updateUser, getUserByCodigoUsuario, login, deleteUser,
  changePassword,getAgenciaXUsuarioAndCompany,assignAgentXUsers, getAllAgenciesOfUser
} from '../controllers/user.controller'
import passport from 'passport'

const router = Router();

router.get('/list',passport.authenticate('jwt', { session: false }), getUsers);
router.post('/register',passport.authenticate('jwt', { session: false }), registerUser);
router.post('/login', login);
router.put('/:c_codigousuario/update',passport.authenticate('jwt', { session: false }), updateUser);
router.get('/:c_codigousuario/getUserByCodigoUsuario',passport.authenticate('jwt', { session: false }), getUserByCodigoUsuario);
router.post('/:c_codigousuario/delete',passport.authenticate('jwt', { session: false }), deleteUser);
router.put('/:c_codigousuario/changePassword',passport.authenticate('jwt', { session: false }), changePassword);
router.post('/getAllAgenciesOfUser', passport.authenticate('jwt', { session: false }), getAllAgenciesOfUser);
router.post('/getAgenciaXUsuarioAndCompany', passport.authenticate('jwt', { session: false }), getAgenciaXUsuarioAndCompany);
router.post('/assignAgentXUsers', passport.authenticate('jwt', { session: false }), assignAgentXUsers);

export default router;