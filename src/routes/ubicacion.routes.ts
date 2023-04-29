import { Router } from "express"
import { registerUbicacionAgencia, getAgenciaUbicacion, updateUbicacionAgencia,
        deleteUbiacionAgencia, getAllAgenciaUbicacion, getAgenciaUbicacionByCodigo} from '../controllers/ubicacion.controller'
import passport from 'passport'

const router = Router();

router.post('/registerUbicacion',passport.authenticate('jwt', { session: false }), registerUbicacionAgencia);
router.post('/listUbicacionesByCodigo',passport.authenticate('jwt', { session: false }), getAgenciaUbicacion);
router.post('/getAgenciaUbicacionByCodigo',passport.authenticate('jwt', { session: false }), getAgenciaUbicacionByCodigo);
router.post('/listAll',passport.authenticate('jwt', { session: false }), getAllAgenciaUbicacion);
router.put('/updateUbicacion',  passport.authenticate('jwt', { session: false }), updateUbicacionAgencia);
router.post('/deleteUbicacion', passport.authenticate('jwt', { session: false }), deleteUbiacionAgencia );


export default router;
