import { Router } from "express"
import { getProvincias,getProvinciasAdmin,registerProvincia,getProvinciaByCodigoProvincia} from '../controllers/provincia.controller'
import passport from 'passport'

const router = Router();

router.get('/list',passport.authenticate('jwt', { session: false }),getProvincias );
router.get('/listAll',passport.authenticate('jwt', { session: false }),getProvinciasAdmin );
router.post('/register',passport.authenticate('jwt', { session: false }), registerProvincia);
//router.put('/update/:n_perfil', );
router.get('/getProvinciaByCodigoProvincia',passport.authenticate('jwt', { session: false }),getProvinciaByCodigoProvincia );
export default router;