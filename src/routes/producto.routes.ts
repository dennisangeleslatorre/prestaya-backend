import { Router } from "express"

import { getProductoDinamico, getProductoStockDinamico } from "../controllers/producto.controller";

import passport from 'passport'

const router = Router();

router.post('/getProductoDinamico',passport.authenticate('jwt', { session: false }), getProductoDinamico);
router.post('/getProductoStockDinamico',passport.authenticate('jwt', { session: false }), getProductoStockDinamico);

export default router;