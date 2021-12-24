import { Router } from "express"
import { getClientes,getClientesXCompania,getClientesAdmin,getClienteByCodigoCliente,registerCliente,updateCliente,deleteCliente,getClienteDinamico} from '../controllers/clientes.controller'
import passport from 'passport'


const router = Router();

router.get('/list',passport.authenticate('jwt', { session: false }), getClientes);
router.get('/:c_codigocompania/listXcompania',passport.authenticate('jwt', { session: false }), getClientesXCompania);
router.get('/listAll',passport.authenticate('jwt', { session: false }), getClientesAdmin);
router.get('/getClienteByCodigoCliente',passport.authenticate('jwt', { session: false }), getClienteByCodigoCliente);
router.put('/update',  passport.authenticate('jwt', { session: false }), updateCliente);
router.post('/delete', passport.authenticate('jwt', { session: false }), deleteCliente );
router.post('/register',passport.authenticate('jwt', { session: false }), registerCliente);
router.get('/getClienteDinamico',getClienteDinamico);


export default router;