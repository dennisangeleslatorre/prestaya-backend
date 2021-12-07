import { Router } from "express"
import { getPaises, registerPais, getPaisesAdmin, getPaisByCodigoPais, updatePais } from '../controllers/pais.controller'

const router = Router();

router.get('/list', getPaises);
router.get('/listAll', getPaisesAdmin);
router.post('/register', registerPais);
router.put('/:c_paiscodigo/update', updatePais);
router.get('/:c_codigopais/getPaisByCodigoPais', getPaisByCodigoPais);

export default router;