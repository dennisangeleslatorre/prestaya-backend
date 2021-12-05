import { Router } from "express"
import { getDistritos,getDistritosAdmin} from '../controllers/distrito.controller'

const router = Router();

router.get('/list',getDistritos);
router.get('/listAdmin',getDistritosAdmin);
/*
router.post('/register', );
router.put('/update/:n_perfil', );
*/
export default router;