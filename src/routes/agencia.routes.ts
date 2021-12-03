import { Router } from "express"
import { getAgencia,registerAgencia} from '../controllers/agencia.controller'

const router = Router();

router.get('/list', getAgencia);
router.post('/register', registerAgencia);


export default router;
