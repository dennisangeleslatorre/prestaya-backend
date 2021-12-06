import { Router } from "express"
import { getTipoProducto,getTipoProductoAdmin} from '../controllers/tipoProducto.controller'

const router = Router();

router.get('/list', getTipoProducto);
router.get('/listAll', getTipoProductoAdmin);
/*
router.post('/register', );
router.put('/update/:n_perfil', );
*/
export default router;