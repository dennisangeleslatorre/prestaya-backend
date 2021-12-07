import { Router } from "express"
import { getTiposDocumento, getTiposDocumentoAdmin, registerTipoDocumento, getTipoDocumentoByCodigoTipoDocumento, updateTipoDocumento } from '../controllers/tipoDocumento.controller'
const router = Router();

router.get('/list', getTiposDocumento);
router.get('/listAll', getTiposDocumentoAdmin);
router.post('/register',registerTipoDocumento);
router.put('/:c_tipodocumento/update', updateTipoDocumento );
router.get('/:c_tipodocumento/getTipoDocumentoByCodigoTipoDocumento', getTipoDocumentoByCodigoTipoDocumento);

export default router;