import { Router } from "express"
import { getPaises,registerPais,getPaisesAdmin} from '../controllers/pais.controller'

const router = Router();

router.get('/list', getPaises);
router.get('/listAdmin', getPaisesAdmin);
router.post('/register', registerPais);
router.put('/update/:n_perfil', );

export default router;