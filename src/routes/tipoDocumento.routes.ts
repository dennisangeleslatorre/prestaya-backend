import { Router } from "express"
import { getTiposDocumento, getTiposDocumentoAdmin, registerTipoDocumento, getTipoDocumentoByCodigoTipoDocumento, updateTipoDocumento,deleteTipoDocumento} from '../controllers/tipoDocumento.controller'
import passport from 'passport'

const router = Router();

router.get('/list',passport.authenticate('jwt', { session: false }), getTiposDocumento);
router.get('/listAll',passport.authenticate('jwt', { session: false }), getTiposDocumentoAdmin);
router.post('/register',passport.authenticate('jwt', { session: false }),registerTipoDocumento);
router.put('/:c_tipodocumento/update',passport.authenticate('jwt', { session: false }), updateTipoDocumento );
router.post('/:c_tipodocumento/delete',passport.authenticate('jwt', { session: false }), deleteTipoDocumento);
router.get('/:c_tipodocumento/getTipoDocumentoByCodigoTipoDocumento',passport.authenticate('jwt', { session: false }), getTipoDocumentoByCodigoTipoDocumento);

export default router;