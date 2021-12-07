import { Router } from "express"
import { getCompania,getCompaniaAdmin,registerCompania} from '../controllers/compania.controller'

const router = Router();

router.get('/list', getCompania);
router.get('/listAll', getCompaniaAdmin);
router.post('/register', registerCompania);
router.put('/update/:n_perfil', );

export default router;