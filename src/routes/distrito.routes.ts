import { Router } from "express"
import { getDistritos,getDistritosAdmin,registerDistrito} from '../controllers/distrito.controller'

const router = Router();

router.get('/list',getDistritos);
router.get('/listAll',getDistritosAdmin);
router.post('/register',registerDistrito );
//router.put('/update/:n_perfil', );

export default router;