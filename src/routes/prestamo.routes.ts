import { Router } from "express"
import {registerPrestamo,getPrestamoDinamico} from '../controllers/prestamo.controller'
import passport from 'passport'


const router = Router();
/*
router.put('/update',  passport.authenticate('jwt', { session: false }), updateCliente);
router.post('/delete', passport.authenticate('jwt', { session: false }), deleteCliente );*/
router.post('/register',passport.authenticate('jwt', { session: false }), registerPrestamo);
router.post('/getPrestamoDinamico',passport.authenticate('jwt', { session: false }),getPrestamoDinamico);


export default router;