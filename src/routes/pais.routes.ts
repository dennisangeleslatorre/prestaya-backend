import { Router } from "express"
import { getPaises, registerPais, getPaisesAdmin, getPaisByCodigoPais, updatePais,deletePais } from '../controllers/pais.controller'
import passport from 'passport'

const router = Router();

router.get('/list',passport.authenticate('jwt', { session: false }), getPaises);
router.get('/listAll',passport.authenticate('jwt', { session: false }), getPaisesAdmin);
router.post('/register',passport.authenticate('jwt', { session: false }), registerPais);
router.put('/:c_paiscodigo/update',passport.authenticate('jwt', { session: false }), updatePais);
router.post('/:c_paiscodigo/delete',passport.authenticate('jwt', { session: false }), deletePais);
router.get('/:c_paiscodigo/getPaisByCodigoPais',passport.authenticate('jwt', { session: false }), getPaisByCodigoPais);

export default router;

