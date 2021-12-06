import { Router } from "express"
import { getTipoProducto,getTipoProductoAdmin,registerTipoProducto} from '../controllers/tipoProducto.controller'

const router = Router();

router.get('/list', getTipoProducto);
router.get('/listAll', getTipoProductoAdmin);
router.post('/register', registerTipoProducto);
/*
router.put('/update/:n_perfil', );
*/
export default router;