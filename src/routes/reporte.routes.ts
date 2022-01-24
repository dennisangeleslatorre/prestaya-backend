import { Router } from "express"
import { getReportesByPerfil, getDataReporteResumidos } from '../controllers/reporte.controller'
import passport from 'passport'

const router = Router();

router.post('/getReportesByPerfil', getReportesByPerfil);
router.post('/getDataReporteResumidos', passport.authenticate('jwt', { session: false }), getDataReporteResumidos);
/*router.post('/getReportesActivos', passport.authenticate('jwt', { session: false }), getReportesActivos);
router.put('/asignarReportPerfil', passport.authenticate('jwt', { session: false }), asignarReportPerfil);*/

export default router;