import { Router } from "express"
import { registerUbicacionAgencia, getAgenciaUbicacion, updateUbicacionAgencia,
        deleteUbiacionAgencia, getAllAgenciaUbicacion, getAgenciaUbicacionByCodigo} from '../controllers/ubicacion.controller'
import passport from 'passport'

const router = Router();

router.post('/register',passport.authenticate('jwt', { session: false }), registerUbicacionAgencia);
router.post('/listUbicacionesByCodigo',passport.authenticate('jwt', { session: false }), getAgenciaUbicacion);
router.post('/getAgenciaUbicacionByCodigo',passport.authenticate('jwt', { session: false }), getAgenciaUbicacionByCodigo);
router.get('/listAll',passport.authenticate('jwt', { session: false }), getAllAgenciaUbicacion);
router.put('/update',  passport.authenticate('jwt', { session: false }), updateUbicacionAgencia);
router.post('/delete', passport.authenticate('jwt', { session: false }), deleteUbiacionAgencia );


export default router;
