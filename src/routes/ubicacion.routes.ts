import { Router } from "express"
import { registerUbicacionAgencia, getAgenciaUbicacion, updateUbicacionAgencia, deleteUbiacionAgencia} from '../controllers/ubicacion.controller'
import passport from 'passport'

const router = Router();

router.post('/registerUbicacion',passport.authenticate('jwt', { session: false }), registerUbicacionAgencia);
router.post('/listUbicacion',passport.authenticate('jwt', { session: false }), getAgenciaUbicacion);
router.put('/updateUbicacion',  passport.authenticate('jwt', { session: false }), updateUbicacionAgencia);
router.post('/deleteUbicacion', passport.authenticate('jwt', { session: false }), deleteUbiacionAgencia );


export default router;
