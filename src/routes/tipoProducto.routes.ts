import { Router } from "express"
import { getTipoProducto, getTipoProductoAdmin, registerTipoProducto, getTipoProductoByCodigoTipoProducto, updateTipoProducto,deleteTipoProducto } from '../controllers/tipoProducto.controller'
import passport from 'passport'

const router = Router();

router.get('/list',passport.authenticate('jwt', { session: false }),getTipoProducto);
router.get('/listAll',passport.authenticate('jwt', { session: false }), getTipoProductoAdmin);
router.post('/register',passport.authenticate('jwt', { session: false }), registerTipoProducto);
router.put('/:c_tipoproducto/update',passport.authenticate('jwt', { session: false }),updateTipoProducto);
router.post('/:c_tipoproducto/delete',passport.authenticate('jwt', { session: false }), deleteTipoProducto);
router.get('/:c_tipoproducto/getTipoProductoByCodigoTipoProducto',passport.authenticate('jwt', { session: false }), getTipoProductoByCodigoTipoProducto);
export default router;