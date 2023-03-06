import { Router } from "express"

import { getTransaccionDinamico } from '../controllers/transaccion.controller'

import passport from 'passport'

const router = Router();

router.post('/getTransaccionDinamico',passport.authenticate('jwt', { session: false }), getTransaccionDinamico);

export default router;