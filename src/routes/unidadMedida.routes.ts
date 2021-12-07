import { Router } from "express"
import { getUnidadesMedida, getUnidadesMedidaAdmin, registerUnidadMedida, getUnidadMedidaByCodigoUnidadMedida, updateUnidadMedida } from '../controllers/unidadMedida.controller'
const router = Router();

router.get('/list', getUnidadesMedida);
router.get('/listAll', getUnidadesMedidaAdmin);
router.post('/register', registerUnidadMedida);
router.put('/:c_unidadmedida/update', updateUnidadMedida);
router.get('/:c_unidadmedida/getUnidadMedidaByCodigoUnidadMedida', getUnidadMedidaByCodigoUnidadMedida);

export default router;