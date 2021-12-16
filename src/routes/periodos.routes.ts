import { Router } from "express"
import { getPeriodos,getPeriodosAdmin,registerPeriodos,getPeriodosByCodigoPeriodos,updatePeriodo,deletePeriodo} from '../controllers/periodos.controller'
import passport from 'passport'

const router = Router();

router.get('/:c_codigocompania/list',passport.authenticate('jwt', { session: false }), getPeriodos);
router.get('/listAll', passport.authenticate('jwt', { session: false }), getPeriodosAdmin);
router.post('/register',passport.authenticate('jwt', { session: false }), registerPeriodos);
router.put('/update',  passport.authenticate('jwt', { session: false }), updatePeriodo);
router.post('/delete', passport.authenticate('jwt', { session: false }), deletePeriodo );
router.post('/getPeriodosByCodigoPeriodos',passport.authenticate('jwt', { session: false }), getPeriodosByCodigoPeriodos);

export default router;