import { Router } from "express";
import {
  getFlujoCajaTiendaDiaDinamico,
  getFlujoCajaTiendaDiaMovDinamico,
  getFlujoCajaTiendaDinamico,
  registerFlujoTienda,
  getFlujoCajaByCodigo,
  updateFlujoTienda,
  getUsuariosCajaActiva
} from "../controllers/flujoTienda.controller";
import passport from "passport";

const router = Router();
router.post(
  "/getFlujoCajaTiendaDiaDinamico",
  passport.authenticate("jwt", { session: false }),
  getFlujoCajaTiendaDiaDinamico
);
router.post(
  "/getFlujoCajaTiendaDiaMovDinamico",
  passport.authenticate("jwt", { session: false }),
  getFlujoCajaTiendaDiaMovDinamico
);
router.post(
  "/getFlujoCajaTiendaDinamico",
  passport.authenticate("jwt", { session: false }),
  getFlujoCajaTiendaDinamico
);
router.post(
  "/registerFlujoTienda",
  passport.authenticate("jwt", { session: false }),
  registerFlujoTienda
);
router.post(
  "/getFlujoCajaByCodigo",
  passport.authenticate("jwt", { session: false }),
  getFlujoCajaByCodigo
);

router.put(
  "/updateFlujoTienda",
  passport.authenticate("jwt", { session: false }),
  updateFlujoTienda
);

router.post(
  "/getUsuariosCajaActiva",
  passport.authenticate("jwt", { session: false }),
  getUsuariosCajaActiva
)

export default router;
