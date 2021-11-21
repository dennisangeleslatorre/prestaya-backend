import { Router } from "express"
import { getUsers, registerUser, updateUser, getUserById, login } from '../controllers/user.controller'

const router = Router();

router.get('/', getUsers);
router.post('/register', registerUser);
router.post('/login', login);
router.put('/update/:id', updateUser);
router.get('/getUserById/:id', getUserById);

export default router;