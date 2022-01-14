import { Router } from "express"
import {registerPrestamo, getPrestamoDinamico, validateTipos, validateUnidades, getPrestamoByCodigoPrestamo, updatePrestamo, anularPrestamo} from '../controllers/prestamo.controller'
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

export default router;