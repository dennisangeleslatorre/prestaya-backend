import { Router } from "express"
import {registerPrestamo, getPrestamoDinamico, validateTipos, validateUnidades, getPrestamoByCodigoPrestamo, updatePrestamo, anularPrestamo, validarRetornarPendiente, retornarPendiente,
        validarEstadoRemate, cambiarEstadoRemate,updtVigentePrestamo, cambiarEstadoEntregar, cancelarPrestamo, anularCancelacion, getCancelacionesByCodigoPrestamo, validarFechaRemate} from '../controllers/prestamo.controller'
import passport from 'passport'


const router = Router();
/*
router.put('/update',  passport.authenticate('jwt', { session: false }), updateCliente);
*/
router.post('/register',passport.authenticate('jwt', { session: false }), registerPrestamo);
router.put('/update',passport.authenticate('jwt', { session: false }), updatePrestamo);
router.post('/getPrestamoByCodigoPrestamo',passport.authenticate('jwt', { session: false }), getPrestamoByCodigoPrestamo);
router.post('/getPrestamoDinamico',passport.authenticate('jwt', { session: false }), getPrestamoDinamico);
router.post('/validateTipos',passport.authenticate('jwt', { session: false }), validateTipos);
router.post('/validateUnidades',passport.authenticate('jwt', { session: false }), validateUnidades);
router.put('/anularPrestamo',passport.authenticate('jwt', { session: false }), anularPrestamo);
router.post('/validarRetornarPendiente',passport.authenticate('jwt', { session: false }), validarRetornarPendiente);
router.put('/updtVigentePrestamo',passport.authenticate('jwt', { session: false }), updtVigentePrestamo);
router.put('/retornarPendiente',passport.authenticate('jwt', { session: false }), retornarPendiente);
router.post('/validarEstadoRemate',passport.authenticate('jwt', { session: false }), validarEstadoRemate);
router.put('/cambiarEstadoRemate',passport.authenticate('jwt', { session: false }), cambiarEstadoRemate);
router.put('/cambiarEstadoEntregar',passport.authenticate('jwt', { session: false }), cambiarEstadoEntregar);
router.post('/getCancelacionesByCodigoPrestamo',passport.authenticate('jwt', { session: false }), getCancelacionesByCodigoPrestamo);
router.post('/cancelarPrestamo',passport.authenticate('jwt', { session: false }), cancelarPrestamo);
router.post('/anularCancelacion',passport.authenticate('jwt', { session: false }), anularCancelacion);
router.post('/validarFechaRemate',passport.authenticate('jwt', { session: false }), validarFechaRemate);

export default router;