import { Router } from "express"
import { getProductosByPrestamo } from '../controllers/prestamoProducto.controller'
import passport from 'passport'

const router = Router();

router.post('/getProductosByPrestamo',passport.authenticate('jwt', { session: false }), getProductosByPrestamo);

export default router;