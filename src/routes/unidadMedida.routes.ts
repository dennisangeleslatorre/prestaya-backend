import { Router } from "express"
import { getUnidadesMedida, getUnidadesMedidaAdmin } from '../controllers/unidadMedida.controller'
const router = Router();

router.get('/list', getUnidadesMedida);
router.get('/listAll', getUnidadesMedidaAdmin);
router.post('/register', );
router.put('/update/:n_perfil', );

export default router;