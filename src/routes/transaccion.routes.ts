import { Router } from "express"

import { getTransaccionDinamico, getTransaccionDetalle, getTransaccionCabecera, registerTransaccion } from '../controllers/transaccion.controller'

import passport from 'passport'

const router = Router();

router.post('/getTransaccionDinamico',passport.authenticate('jwt', { session: false }), getTransaccionDinamico);
router.post('/getTransaccionDetalle',passport.authenticate('jwt', { session: false }), getTransaccionDetalle);
router.post('/getTransaccionCabecera',passport.authenticate('jwt', { session: false }), getTransaccionCabecera);
router.post('/registerTransaccion',passport.authenticate('jwt', { session: false }), registerTransaccion);

export default router;