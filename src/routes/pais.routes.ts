import { Router } from "express"
import { getPaises,registerPais} from '../controllers/pais.controller'

const router = Router();

router.get('/list', getPaises);
router.post('/register', registerPais);
router.put('/update/:n_perfil', );

export default router;