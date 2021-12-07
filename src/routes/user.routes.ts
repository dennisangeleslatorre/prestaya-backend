import { Router } from "express"
import { getUsers, registerUser, updateUser, getUserByCodigoUsuario, login, deleteUser } from '../controllers/user.controller'

const router = Router();

router.get('/list', getUsers);
router.post('/register', registerUser);
router.post('/login', login);
router.put('/:c_codigousuario/update', updateUser);
router.get('/:c_codigousuario/getUserByCodigoUsuario', getUserByCodigoUsuario);
router.delete('/:c_codigousuario/delete', deleteUser);

export default router;