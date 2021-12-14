import { Router } from "express"
import { getPeriodos,getPeriodosAdmin,registerPeriodos,getPeriodosByCodigoPeriodos} from '../controllers/periodos.controller'
import passport from 'passport'

const router = Router();

router.get('/:c_codigocompania/list',passport.authenticate('jwt', { session: false }), getPeriodos);
router.get('/listAll', passport.authenticate('jwt', { session: false }), getPeriodosAdmin);
router.post('/register',passport.authenticate('jwt', { session: false }), registerPeriodos);
router.put('/update/:n_perfil', );
router.post('/getPeriodosByCodigoPeriodos',passport.authenticate('jwt', { session: false }), getPeriodosByCodigoPeriodos);

export default router;