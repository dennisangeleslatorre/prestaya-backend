import { Router } from "express"
import { getTipoMovimientoCaja,getTipoMovimientoCajaAdmin,registerTipoMovimientoCaja,getTipoMovimientoCajaByCodigoTipoMovimientoCaja,deleteTipoMovimientoCaja,updateTipoMovimientoCaja} from '../controllers/tipoMovimientoCaja.controller'
import passport from 'passport'

const router = Router();

router.get('/list',passport.authenticate('jwt', { session: false }), getTipoMovimientoCaja);
router.get('/listAll',passport.authenticate('jwt', { session: false }), getTipoMovimientoCajaAdmin);
router.post('/register',passport.authenticate('jwt', { session: false }), registerTipoMovimientoCaja);
router.put('/:c_tipomovimientocc/update',passport.authenticate('jwt', { session: false }), updateTipoMovimientoCaja );
router.post('/:c_tipomovimientocc/delete',passport.authenticate('jwt', { session: false }), deleteTipoMovimientoCaja);
router.get('/:c_tipomovimientocc/getTipoMovimientoCajaByCodigoTipoMovimientoCaja',passport.authenticate('jwt', { session: false }), getTipoMovimientoCajaByCodigoTipoMovimientoCaja);


export default router;
