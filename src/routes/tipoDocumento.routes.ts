import { Router } from "express"
import { getTiposDocumento, getTiposDocumentoAdmin,registerTipoDocumento } from '../controllers/tipoDocumento.controller'
const router = Router();

router.get('/list', getTiposDocumento);
router.get('/listAll', getTiposDocumentoAdmin);
router.post('/register',registerTipoDocumento );
router.put('/update/:n_perfil', );

export default router;