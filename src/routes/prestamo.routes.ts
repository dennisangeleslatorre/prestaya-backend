import { Router } from "express"
import { registerPrestamo, getPrestamoDinamico, validateTipos, validateUnidades, getPrestamoByCodigoPrestamo, updatePrestamo, anularPrestamo, validarRetornarPendiente, retornarPendiente,
        validarEstadoRemate, cambiarEstadoRemate,updtVigentePrestamo, cambiarEstadoEntregar, cancelarPrestamo, anularCancelacion, getCancelacionesByCodigoPrestamo, validarFechaRemate,
        obtenerDatosFormatoPrestamo, retornarEntrega, retornarRemate, getPrestamoByCodigoPrestamoParaTicket, getCancelacionesByNLinea, obtenerSaldoPrestamo, obtenerDatosTicketVentaTercero,
        obtenerDatosActaEntrega } from '../controllers/prestamo.controller'
import passport from 'passport'


const router = Router();
/*
router.put('/update',  passport.authenticate('jwt', { session: false }), updateCliente);
*/
router.post('/register',passport.authenticate('jwt', { session: false }), registerPrestamo);
router.put('/update',passport.authenticate('jwt', { session: false }), updatePrestamo);
router.post('/getPrestamoByCodigoPrestamo',passport.authenticate('jwt', { session: false }), getPrestamoByCodigoPrestamo);
router.post('/getPrestamoByCodigoPrestamoParaTicket',passport.authenticate('jwt', { session: false }), getPrestamoByCodigoPrestamoParaTicket);
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
router.post('/getCancelacionesByNLinea',passport.authenticate('jwt', { session: false }), getCancelacionesByNLinea);
router.post('/cancelarPrestamo',passport.authenticate('jwt', { session: false }), cancelarPrestamo);
router.post('/anularCancelacion',passport.authenticate('jwt', { session: false }), anularCancelacion);
router.post('/validarFechaRemate',passport.authenticate('jwt', { session: false }), validarFechaRemate);
router.post('/obtenerDatosFormatoPrestamo',passport.authenticate('jwt', { session: false }), obtenerDatosFormatoPrestamo);
router.put('/retornarEntrega',passport.authenticate('jwt', { session: false }), retornarEntrega);
router.put('/retornarRemate',passport.authenticate('jwt', { session: false }), retornarRemate);
router.post('/obtenerSaldoPrestamo',passport.authenticate('jwt', { session: false }), obtenerSaldoPrestamo);
router.post('/obtenerDatosTicketVentaTercero',passport.authenticate('jwt', { session: false }), obtenerDatosTicketVentaTercero);
router.post('/obtenerDatosActaEntrega',passport.authenticate('jwt', { session: false }), obtenerDatosActaEntrega);

export default router;