import { Router } from "express"
import { registerFllujoCaja, updateFlujoCaja, getFlujoCajaDinamico, getFlujoCajaByCodigo, getFlujoCajaDiasByCodigo, getFlujoCajaMovimientosByCodigo } from '../controllers/flujoCaja.controller'
import passport from 'passport'

const router = Router();
router.post('/register',passport.authenticate('jwt', { session: false }), registerFllujoCaja);
router.put('/update',passport.authenticate('jwt', { session: false }), updateFlujoCaja);
router.post('/getFlujoCajaDinamico',passport.authenticate('jwt', { session: false }), getFlujoCajaDinamico);
router.post('/getFlujoCajaByCodigo',passport.authenticate('jwt', { session: false }), getFlujoCajaByCodigo);
router.post('/getFlujoCajaDiasByCodigo',passport.authenticate('jwt', { session: false }), getFlujoCajaDiasByCodigo);
router.post('/getFlujoCajaMovimientosByCodigo',passport.authenticate('jwt', { session: false }), getFlujoCajaMovimientosByCodigo);

export default router;