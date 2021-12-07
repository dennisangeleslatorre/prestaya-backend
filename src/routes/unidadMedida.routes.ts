import { Router } from "express"
import { getUnidadesMedida, getUnidadesMedidaAdmin,registerUnidadMedida,getUnidadMedidaByCodigoUnidadMedida} from '../controllers/unidadMedida.controller'
const router = Router();

router.get('/list', getUnidadesMedida);
router.get('/listAll', getUnidadesMedidaAdmin);
router.post('/register', registerUnidadMedida);
router.put('/update/:n_perfil', );
router.post('/:c_unidadmedida/getUnidadMedidaByCodigoUnidadMedida', getUnidadMedidaByCodigoUnidadMedida);

export default router;