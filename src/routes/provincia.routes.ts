import { Router } from "express"
import { getProvincias,getProvinciasAdmin} from '../controllers/provincia.controller'

const router = Router();

router.get('/list',getProvincias );
router.get('/listAdmin',getProvinciasAdmin );
/*
router.post('/register', );
router.put('/update/:n_perfil', );
*/
export default router;