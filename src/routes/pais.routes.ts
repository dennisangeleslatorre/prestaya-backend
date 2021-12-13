import { Router } from "express"
import { getPaises, registerPais, getPaisesAdmin, getPaisByCodigoPais, updatePais } from '../controllers/pais.controller'
import passport from 'passport'

const router = Router();

router.get('/list',passport.authenticate('jwt', { session: false }), getPaises);
router.get('/listAll',passport.authenticate('jwt', { session: false }), getPaisesAdmin);
router.post('/register',passport.authenticate('jwt', { session: false }), registerPais);
router.put('/:c_paiscodigo/update',passport.authenticate('jwt', { session: false }), updatePais);
router.get('/:c_codigopais/getPaisByCodigoPais',passport.authenticate('jwt', { session: false }), getPaisByCodigoPais);

export default router;

