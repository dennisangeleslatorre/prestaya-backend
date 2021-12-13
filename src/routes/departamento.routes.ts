import { Router } from "express"
import { getDepartamentos, getDepartamentosAdmin, getDepartamentoByCodigoDepartamento, registerDepartamento, updateDepartamento} from '../controllers/departamento.controller'
import passport from 'passport'

const router = Router();

router.get('/list', passport.authenticate('jwt', { session: false }), getDepartamentos );
router.get('/listAll', passport.authenticate('jwt', { session: false }), getDepartamentosAdmin );
router.post('/register', passport.authenticate('jwt', { session: false }), registerDepartamento );
router.put('/update',  passport.authenticate('jwt', { session: false }), updateDepartamento);
router.post('/getDepartamentoByCodigoDepartamento', passport.authenticate('jwt', { session: false }), getDepartamentoByCodigoDepartamento);

export default router;