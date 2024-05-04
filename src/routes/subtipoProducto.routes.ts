import { Router } from "express";
import {
  getSubtipoProducto,
  getSubtipoProductoAdmin,
  getSubtipoByTipoProducto,
  registerSubtipoProducto,
  getSubtipoProductoByCodigoSubtipoProducto,
  deleteSubtipoProducto,
  updateSubtipoProducto,
} from "../controllers/subtipo.controller";
import passport from "passport";

const router = Router();

router.get(
  "/list",
  passport.authenticate("jwt", { session: false }),
  getSubtipoProducto
);
router.get(
  "/listAll",
  passport.authenticate("jwt", { session: false }),
  getSubtipoProductoAdmin
);
router.get(
  "/get/:c_tipoproducto",
  passport.authenticate("jwt", { session: false }),
  getSubtipoByTipoProducto
);
router.post(
  "/register",
  passport.authenticate("jwt", { session: false }),
  registerSubtipoProducto
);
router.put(
  "/update",
  passport.authenticate("jwt", { session: false }),
  updateSubtipoProducto
);
router.post(
  "/delete",
  passport.authenticate("jwt", { session: false }),
  deleteSubtipoProducto
);
router.post(
  "/show",
  passport.authenticate("jwt", { session: false }),
  getSubtipoProductoByCodigoSubtipoProducto
);

export default router;
