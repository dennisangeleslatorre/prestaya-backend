import { Router } from "express"
import { getAgencia,getAgenciaAdmin,registerAgencia} from '../controllers/agencia.controller'
import passport from 'passport'

const router = Router();

router.get('/list',passport.authenticate('jwt', { session: false }), getAgencia);
router.get('/listAll',passport.authenticate('jwt', { session: false }), getAgenciaAdmin);
router.post('/register',passport.authenticate('jwt', { session: false }), registerAgencia);


export default router;
