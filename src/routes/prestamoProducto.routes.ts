import { Router } from "express"
import { getProductosByPrestamo, getProductosByFormato } from '../controllers/prestamoProducto.controller'
import passport from 'passport'

const router = Router();

router.post('/getProductosByPrestamo',passport.authenticate('jwt', { session: false }), getProductosByPrestamo);
router.post('/getProductosByFormato',passport.authenticate('jwt', { session: false }), getProductosByFormato);

export default router;