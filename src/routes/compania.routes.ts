import { Router } from "express"
import { getCompania,getCompaniaAdmin} from '../controllers/compania.controller'

const router = Router();

router.get('/list', getCompania);
router.get('/listAll', getCompaniaAdmin);
router.post('/register', );
router.put('/update/:n_perfil', );

export default router;