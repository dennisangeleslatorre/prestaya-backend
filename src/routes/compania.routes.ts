import { Router } from "express"
import { getCompania, getCompaniaAdmin, registerCompania, getCompaniaByCodigoCompania, updateCompania } from '../controllers/compania.controller'
import passport from 'passport'

const router = Router();

router.get('/list', passport.authenticate('jwt', { session: false }), getCompania);
router.get('/listAll', passport.authenticate('jwt', { session: false }), getCompaniaAdmin);
router.post('/register', passport.authenticate('jwt', { session: false }), registerCompania);
router.get('/:c_codigocompania/getCompaniaByCodigoCompania', passport.authenticate('jwt', { session: false }), getCompaniaByCodigoCompania);
router.put('/update', passport.authenticate('jwt', { session: false }), updateCompania);

export default router;