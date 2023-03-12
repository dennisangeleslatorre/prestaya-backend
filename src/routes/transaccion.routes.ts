import { Router } from "express"

import { getTransaccionDinamico } from '../controllers/transaccion.controller'
import { getTransaccionDetalle } from '../controllers/transaccion.controller'
import { updateTransaccionAnular } from '../controllers/transaccion.controller'

import passport from 'passport'

const router = Router();

router.post('/getTransaccionDinamico',passport.authenticate('jwt', { session: false }), getTransaccionDinamico);
router.post('/getTransaccionDetalle',passport.authenticate('jwt', { session: false }), getTransaccionDetalle);
router.put('/updateTransaccionAnular',passport.authenticate('jwt', { session: false }),updateTransaccionAnular);

export default router;