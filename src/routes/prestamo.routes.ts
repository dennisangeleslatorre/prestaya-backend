import { Router } from "express"
import {registerPrestamo, getPrestamoDinamico, validateTipos, validateUnidades} from '../controllers/prestamo.controller'
import passport from 'passport'


const router = Router();
/*
router.put('/update',  passport.authenticate('jwt', { session: false }), updateCliente);
router.post('/delete', passport.authenticate('jwt', { session: false }), deleteCliente );*/
router.post('/register',passport.authenticate('jwt', { session: false }), registerPrestamo);
router.post('/getPrestamoDinamico',passport.authenticate('jwt', { session: false }),getPrestamoDinamico);
router.post('/validateTipos',passport.authenticate('jwt', { session: false }),validateTipos);
router.post('/validateUnidades',passport.authenticate('jwt', { session: false }),validateUnidades);


export default router;