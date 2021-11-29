import { Router } from "express"
import { getUsers, registerUser, updateUser, getUserByCodigoUsuario, login } from '../controllers/user.controller'

const router = Router();

router.get('/list', getUsers);
router.post('/register', registerUser);
router.post('/login', login);
router.put('/update/:c_codigousuario', updateUser);
router.get('/getUserByCodigoUsuario/:c_codigousuario', getUserByCodigoUsuario);

export default router;