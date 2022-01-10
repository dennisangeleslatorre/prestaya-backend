import { Router } from "express"
import {registerPrestamo, getPrestamoDinamico, validateTipos, validateUnidades,updateProductoGarantia,deleteProductoGarantia} from '../controllers/prestamo.controller'
import passport from 'passport'


const router = Router();
/*
router.put('/update',  passport.authenticate('jwt', { session: false }), updateCliente);
*/
router.post('/register',passport.authenticate('jwt', { session: false }), registerPrestamo);
router.post('/getPrestamoDinamico',passport.authenticate('jwt', { session: false }),getPrestamoDinamico);
router.post('/validateTipos',passport.authenticate('jwt', { session: false }),validateTipos);
router.post('/validateUnidades',passport.authenticate('jwt', { session: false }),validateUnidades);
router.post('/updateProductoGarantia', passport.authenticate('jwt', { session: false }), updateProductoGarantia );
router.post('/deleteProductoGarantia', passport.authenticate('jwt', { session: false }), deleteProductoGarantia );

export default router;