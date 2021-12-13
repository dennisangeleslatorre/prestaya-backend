import { Router } from "express"
import { getUnidadesMedida, getUnidadesMedidaAdmin, registerUnidadMedida, getUnidadMedidaByCodigoUnidadMedida, updateUnidadMedida } from '../controllers/unidadMedida.controller'
import passport from 'passport'

const router = Router();

router.get('/list',passport.authenticate('jwt', { session: false }),getUnidadesMedida);
router.get('/listAll',passport.authenticate('jwt', { session: false }),getUnidadesMedidaAdmin);
router.post('/register',passport.authenticate('jwt', { session: false }),registerUnidadMedida);
router.put('/:c_unidadmedida/update',passport.authenticate('jwt', { session: false }),updateUnidadMedida);
router.get('/:c_unidadmedida/getUnidadMedidaByCodigoUnidadMedida',passport.authenticate('jwt', { session: false }),getUnidadMedidaByCodigoUnidadMedida);

export default router;