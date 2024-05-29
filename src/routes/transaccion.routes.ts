import { Router } from "express";

import {
  getTransaccionDinamico,
  getTransaccionDetalle,
  getTransaccionCabecera,
  registerTransaccion,
  getReporteTransaccion,
  postTransaccionProductoIngreso,
  postTransaccionProductoSalida,
  postConfirmarTransaccionProductoSalida,
  getTransaccionesPorConfirmar,
  postConfirmarTransaccionProductoSalidaOtraAgencia,
  postAnularTransaccion
} from "../controllers/transaccion.controller";

import passport from "passport";

const router = Router();

router.post(
  "/getTransaccionDinamico",
  passport.authenticate("jwt", { session: false }),
  getTransaccionDinamico
);
router.post(
  "/getTransaccionDetalle",
  passport.authenticate("jwt", { session: false }),
  getTransaccionDetalle
);
router.post(
  "/getTransaccionCabecera",
  passport.authenticate("jwt", { session: false }),
  getTransaccionCabecera
);
router.post(
  "/registerTransaccion",
  passport.authenticate("jwt", { session: false }),
  registerTransaccion
);
router.post(
  "/getReporteTransaccion",
  passport.authenticate("jwt", { session: false }),
  getReporteTransaccion
);
router.post(
  "/postTransaccionProductoIngreso",
  passport.authenticate("jwt", { session: false }),
  postTransaccionProductoIngreso
);
router.post(
  "/postTransaccionProductoSalida",
  passport.authenticate("jwt", { session: false }),
  postTransaccionProductoSalida
);
router.post(
  "/postConfirmarTransaccionProductoSalida",
  passport.authenticate("jwt", { session: false }),
  postConfirmarTransaccionProductoSalida
);
router.post(
  "/getTransaccionesPorConfirmar",
  passport.authenticate("jwt", { session: false }),
  getTransaccionesPorConfirmar
);
router.post(
    "/postConfirmarTransaccionProductoSalidaOtraAgencia",
    passport.authenticate("jwt", { session: false }),
    postConfirmarTransaccionProductoSalidaOtraAgencia
  );
router.post(
    "/postAnularTransaccion",
    passport.authenticate("jwt", { session: false }),
    postAnularTransaccion
  );
export default router;
