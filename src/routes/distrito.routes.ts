import { Router } from "express"
import { getDistritos, getDistritosAdmin, registerDistrito, getDistritoByCodigoDistrito, updateDistrito,deleteDistrito } from '../controllers/distrito.controller'
import passport from 'passport'

const router = Router();

router.get('/list', passport.authenticate('jwt', { session: false }), getDistritos);
router.get('/listAll', passport.authenticate('jwt', { session: false }), getDistritosAdmin);
router.post('/register', passport.authenticate('jwt', { session: false }), registerDistrito );
router.put('/update', passport.authenticate('jwt', { session: false }), updateDistrito );
router.post('/delete', passport.authenticate('jwt', { session: false }), deleteDistrito);
router.post('/getDistritoByCodigoDistrito', passport.authenticate('jwt', { session: false }), getDistritoByCodigoDistrito);

export default router;