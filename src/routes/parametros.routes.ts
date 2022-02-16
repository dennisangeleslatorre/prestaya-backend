import { Router } from "express"
import { getParametros,getParametrosAdmin,registerParametros,getParametrosByCodigoParametros,updateParametro,deleteParametro,getParametroSession} from '../controllers/parametros.controller'
import passport from 'passport'

const router = Router();

router.get('/:c_codigocompania/list',passport.authenticate('jwt', { session: false }), getParametros);
router.get('/listAll', passport.authenticate('jwt', { session: false }), getParametrosAdmin);
router.post('/register',passport.authenticate('jwt', { session: false }), registerParametros);
router.put('/update',  passport.authenticate('jwt', { session: false }), updateParametro);
router.post('/delete', passport.authenticate('jwt', { session: false }), deleteParametro );
router.post('/getParametrosByCodigoParametros',passport.authenticate('jwt', { session: false }), getParametrosByCodigoParametros);
router.get('/getParametroSession', passport.authenticate('jwt', { session: false }), getParametroSession);

export default router;