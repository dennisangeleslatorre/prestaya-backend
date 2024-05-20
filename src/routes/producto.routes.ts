import { Router } from "express";

import {
  getProductoDinamico,
  getProductoStockDinamico,
  actualizarDatosUbicacionSubtipo,
  getProductoDinamicoConPrecio
} from "../controllers/producto.controller";

import passport from "passport";

const router = Router();

router.post(
  "/getProductoDinamico",
  passport.authenticate("jwt", { session: false }),
  getProductoDinamico
);
router.post(
  "/getProductoStockDinamico",
  passport.authenticate("jwt", { session: false }),
  getProductoStockDinamico
);
router.put(
  "/actualizarDatosUbicacionSubtipo",
  passport.authenticate("jwt", { session: false }),
  actualizarDatosUbicacionSubtipo
);
router.post(
  "/getProductoDinamicoConPrecio",
  passport.authenticate("jwt", { session: false }),
  getProductoDinamicoConPrecio
);

export default router;
