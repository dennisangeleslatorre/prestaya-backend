import { Router } from "express"
import { getDepartamentos,getDepartamentosAdmin,registerDepartamento} from '../controllers/departamento.controller'

const router = Router();

router.get('/list',getDepartamentos );
router.get('/listAll',getDepartamentosAdmin );
router.post('/register',registerDepartamento );
//router.put('/update/:n_perfil', );

export default router;