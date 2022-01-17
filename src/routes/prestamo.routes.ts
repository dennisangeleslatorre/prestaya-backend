import { Router } from "express"
import {registerPrestamo, getPrestamoDinamico, validateTipos, validateUnidades, getPrestamoByCodigoPrestamo, updatePrestamo, anularPrestamo, validarRetornarPendiente,
        retornarPendiente, validarEstadoRemate, cambiarEstadoRemate,updtVigentePrestamo, cambiarEstadoEntregar, cancelarPrestamo} from '../controllers/prestamo.controller'
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
router.post('/cancelarPrestamo',passport.authenticate('jwt', { session: false }), cancelarPrestamo);


export default router;