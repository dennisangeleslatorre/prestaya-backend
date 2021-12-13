import { Router } from "express"
import { getParametros,getParametrosAdmin,registerParametros,getParametrosByCodigoParametros} from '../controllers/parametros.controller'
import passport from 'passport'

const router = Router();

router.get('/:c_codigocompania/list',passport.authenticate('jwt', { session: false }), getParametros);
router.get('/listAll', passport.authenticate('jwt', { session: false }), getParametrosAdmin);
router.post('/register',passport.authenticate('jwt', { session: false }), registerParametros);
router.put('/update/:n_perfil', );
router.post('/getParametrosByCodigoParametros',passport.authenticate('jwt', { session: false }), getParametrosByCodigoParametros);

export default router;