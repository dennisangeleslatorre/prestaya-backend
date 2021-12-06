import { Router } from "express"
import { getProvincias,getProvinciasAdmin,registerProvincia} from '../controllers/provincia.controller'

const router = Router();

router.get('/list',getProvincias );
router.get('/listAll',getProvinciasAdmin );
router.post('/register', registerProvincia);
//router.put('/update/:n_perfil', );

export default router;