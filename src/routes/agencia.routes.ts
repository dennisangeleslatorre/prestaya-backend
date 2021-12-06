import { Router } from "express"
import { getAgencia,getAgenciaAdmin,registerAgencia} from '../controllers/agencia.controller'

const router = Router();

router.get('/list', getAgencia);
router.get('/listAll', getAgenciaAdmin);
router.post('/register', registerAgencia);


export default router;
