import { Router } from "express"
import { getTiposDocumento, getTiposDocumentoAdmin,registerTipoDocumento,getTipoDocumentoByCodigoTipoDocumento} from '../controllers/tipoDocumento.controller'
const router = Router();

router.get('/list', getTiposDocumento);
router.get('/listAll', getTiposDocumentoAdmin);
router.post('/register',registerTipoDocumento);
router.put('/update/:n_perfil', );
router.post('/:c_tipodocumento/getTipoDocumentoByCodigoTipoDocumento',getTipoDocumentoByCodigoTipoDocumento);

export default router;