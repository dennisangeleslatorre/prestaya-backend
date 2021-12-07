import { Router } from "express"
import { getPaises,registerPais,getPaisesAdmin,getPaisByCodigoPais} from '../controllers/pais.controller'

const router = Router();

router.get('/list', getPaises);
router.get('/listAll', getPaisesAdmin);
router.post('/register', registerPais);
router.put('/update/:n_perfil', );
router.get('/:c_codigousuario/getPaisByCodigoPais', getPaisByCodigoPais);

export default router;