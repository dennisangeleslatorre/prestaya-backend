import { Router } from "express"
import { getProvincias, getProvinciasAdmin, registerProvincia, getProvinciaByCodigoProvincia, updateProvincia,deleteProvincia } from '../controllers/provincia.controller'
import passport from 'passport'

const router = Router();

router.get('/list', passport.authenticate('jwt', { session: false }), getProvincias );
router.get('/listAll', passport.authenticate('jwt', { session: false }), getProvinciasAdmin );
router.post('/register', passport.authenticate('jwt', { session: false }), registerProvincia);
router.put('/update', passport.authenticate('jwt', { session: false }), updateProvincia);
router.post('/delete', passport.authenticate('jwt', { session: false }), deleteProvincia);
router.post('/getProvinciaByCodigoProvincia', passport.authenticate('jwt', { session: false }), getProvinciaByCodigoProvincia );
export default router;