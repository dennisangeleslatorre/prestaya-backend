import { Router } from "express"
import { getFlujoCajaTiendaDiaDinamico,getFlujoCajaTiendaDiaMovDinamico,getFlujoCajaTiendaDinamico} from '../controllers/flujoTienda.controller'
import passport from 'passport'

const router = Router();
router.post('/getFlujoCajaTiendaDiaDinamico',passport.authenticate('jwt', { session: false }), getFlujoCajaTiendaDiaDinamico);
router.post('/getFlujoCajaTiendaDiaMovDinamico',passport.authenticate('jwt', { session: false }), getFlujoCajaTiendaDiaMovDinamico);
router.post('/getFlujoCajaTiendaDinamico',passport.authenticate('jwt', { session: false }), getFlujoCajaTiendaDinamico);


export default router;