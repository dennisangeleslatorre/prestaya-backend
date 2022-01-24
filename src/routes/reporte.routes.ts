import { Router } from "express"
import { getReportesByPerfil, getDataReporteResumidos, getDataReporteDetallado } from '../controllers/reporte.controller'
import passport from 'passport'

const router = Router();

router.post('/getReportesByPerfil', getReportesByPerfil);
router.post('/getDataReporteResumidos', passport.authenticate('jwt', { session: false }), getDataReporteResumidos);
router.post('/getDataReporteDetallado', passport.authenticate('jwt', { session: false }), getDataReporteDetallado);
//router.post('/getDataReporteResumidosPrestamo', passport.authenticate('jwt', { session: false }), getDataReporteResumidosPrestamo);
/*router.post('/getReportesActivos', passport.authenticate('jwt', { session: false }), getReportesActivos);
router.put('/asignarReportPerfil', passport.authenticate('jwt', { session: false }), asignarReportPerfil);*/

export default router;