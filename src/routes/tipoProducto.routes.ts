import { Router } from "express"
import { getTipoProducto, getTipoProductoAdmin, registerTipoProducto, getTipoProductoByCodigoTipoProducto, updateTipoProducto } from '../controllers/tipoProducto.controller'

const router = Router();

router.get('/list', getTipoProducto);
router.get('/listAll', getTipoProductoAdmin);
router.post('/register', registerTipoProducto);
router.put('/:c_tipoproducto/update', updateTipoProducto);
router.get('/:c_tipoproducto/getTipoProductoByCodigoTipoProducto', getTipoProductoByCodigoTipoProducto);
export default router;