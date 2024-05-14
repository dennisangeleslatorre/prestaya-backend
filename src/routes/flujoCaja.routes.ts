import { Router } from "express"
import { registerFllujoCaja, updateFlujoCaja, getFlujoCajaDinamico, getFlujoCajaByCodigo, getFlujoCajaDiasByCodigo,
    getFlujoCajaMovimientosByCodigo, getMovimientosCajaUsuarioxConfirmar, confirmarMovimiento,
    getCajaUsuarioByAgenciaAndUsuario,updateFlujoTienda } from '../controllers/flujoCaja.controller'
import passport from 'passport'

const router = Router();
router.post('/register',passport.authenticate('jwt', { session: false }), registerFllujoCaja);
router.put('/update',passport.authenticate('jwt', { session: false }), updateFlujoCaja);
router.post('/getFlujoCajaDinamico',passport.authenticate('jwt', { session: false }), getFlujoCajaDinamico);
router.post('/getFlujoCajaByCodigo',passport.authenticate('jwt', { session: false }), getFlujoCajaByCodigo);
router.post('/getFlujoCajaDiasByCodigo',passport.authenticate('jwt', { session: false }), getFlujoCajaDiasByCodigo);
router.post('/getFlujoCajaMovimientosByCodigo',passport.authenticate('jwt', { session: false }), getFlujoCajaMovimientosByCodigo);
router.post('/getMovimientosCajaUsuarioxConfirmar',passport.authenticate('jwt', { session: false }), getMovimientosCajaUsuarioxConfirmar);
router.post('/confirmarMovimiento',passport.authenticate('jwt', { session: false }), confirmarMovimiento);
router.post('/getCajaUsuarioByAgenciaAndUsuario',passport.authenticate('jwt', { session: false }), getCajaUsuarioByAgenciaAndUsuario);
router.post('/updateFlujoTienda',passport.authenticate('jwt', { session: false }), updateFlujoTienda);


export default router;