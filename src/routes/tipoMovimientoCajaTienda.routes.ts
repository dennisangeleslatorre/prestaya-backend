import { Router } from "express";
import {
  getTipoMovimientoCajaTienda,
  getTipoMovimientoCajaTiendaAdmin,
  registerTipoMovimientoCajaTienda,
  getTipoMovimientoCajaTiendaByCodigoTipoMovimientoCajaTienda,
  deleteTipoMovimientoCajaTienda,
  updateTipoMovimientoCajaTienda,
  getTipoMovimientoCajaTiendaParaTransacciones
} from "../controllers/tipoMovimientoCajaTienda.controller";
import passport from "passport";

const router = Router();

router.get(
  "/list",
  passport.authenticate("jwt", { session: false }),
  getTipoMovimientoCajaTienda
);
router.get(
  "/listAll",
  passport.authenticate("jwt", { session: false }),
  getTipoMovimientoCajaTiendaAdmin
);
router.post(
  "/register",
  passport.authenticate("jwt", { session: false }),
  registerTipoMovimientoCajaTienda
);
router.put(
  "/:c_tipomovimientoctd/update",
  passport.authenticate("jwt", { session: false }),
  updateTipoMovimientoCajaTienda
);
router.post(
  "/:c_tipomovimientoctd/delete",
  passport.authenticate("jwt", { session: false }),
  deleteTipoMovimientoCajaTienda
);
router.get(
  "/:c_tipomovimientoctd/show",
  passport.authenticate("jwt", { session: false }),
  getTipoMovimientoCajaTiendaByCodigoTipoMovimientoCajaTienda
);
router.post(
  "/getTipoMovimientoCajaTiendaParaTransacciones",
  passport.authenticate("jwt", { session: false }),
  getTipoMovimientoCajaTiendaParaTransacciones
);

export default router;
