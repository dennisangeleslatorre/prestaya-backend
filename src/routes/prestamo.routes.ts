import { Router } from "express"
import {registerPrestamo} from '../controllers/prestamo.controller'
import passport from 'passport'


const router = Router();
/*
router.get('/list',passport.authenticate('jwt', { session: false }), getClientes);
router.get('/:c_codigocompania/listXcompania',passport.authenticate('jwt', { session: false }), getClientesXCompania);
router.get('/listAll',passport.authenticate('jwt', { session: false }), getClientesAdmin);
router.get('/getClienteByCodigoCliente',passport.authenticate('jwt', { session: false }), getClienteByCodigoCliente);
router.put('/update',  passport.authenticate('jwt', { session: false }), updateCliente);
router.post('/delete', passport.authenticate('jwt', { session: false }), deleteCliente );*/
router.post('/register',passport.authenticate('jwt', { session: false }), registerPrestamo);
//router.post('/getClienteDinamico',passport.authenticate('jwt', { session: false }),getClienteDinamico);


export default router;