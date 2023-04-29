import { Router } from "express"
import { getAgencia,getAgenciaAdmin,registerAgencia,getAgenciaByCodigoAgencia,deleteAgencia,updateAgencia,getAgenciaAndCompaniaByCodigo,registerUbicacionAgencia,
getAgenciaUbicacion,updateUbicacionAgencia,deleteUbiacionAgencia} from '../controllers/agencia.controller'
import passport from 'passport'

const router = Router();

router.post('/list',passport.authenticate('jwt', { session: false }), getAgencia);
router.get('/listAll',passport.authenticate('jwt', { session: false }), getAgenciaAdmin);
router.post('/register',passport.authenticate('jwt', { session: false }), registerAgencia);
router.put('/update',  passport.authenticate('jwt', { session: false }), updateAgencia);
router.post('/delete', passport.authenticate('jwt', { session: false }), deleteAgencia );
router.post('/getAgenciaByCodigoAgencia',passport.authenticate('jwt', { session: false }), getAgenciaByCodigoAgencia);
router.post('/getAgenciaAndCompaniaByCodigo',passport.authenticate('jwt', { session: false }), getAgenciaAndCompaniaByCodigo);
router.post('/registerUbicacion',passport.authenticate('jwt', { session: false }), registerUbicacionAgencia);
router.post('/listUbicacion',passport.authenticate('jwt', { session: false }), getAgenciaUbicacion);
router.put('/updateUbicacion',  passport.authenticate('jwt', { session: false }), updateUbicacionAgencia);
router.post('/deleteUbicacion', passport.authenticate('jwt', { session: false }), deleteUbiacionAgencia );


export default router;
