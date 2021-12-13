import { Router } from "express"
import { getClientes,getClientesXCompania,getClientesAdmin,getClienteByCodigoCliente} from '../controllers/clientes.controller'
import passport from 'passport'

const router = Router();

router.get('/list',passport.authenticate('jwt', { session: false }), getClientes);
router.get('/:c_codigocompania/listXcompania',passport.authenticate('jwt', { session: false }), getClientesXCompania);
router.get('/listAll',passport.authenticate('jwt', { session: false }), getClientesAdmin);
//router.post('/register',passport.authenticate('jwt', { session: false }), registerCompania);
router.get('/getClienteByCodigoCliente',passport.authenticate('jwt', { session: false }), getClienteByCodigoCliente);
router.put('/update/:n_perfil', );

export default router;