import { Router } from "express"
import { getReportesByPerfil, getDataReporteResumidos, getDataReporteDetallado, getReportes, assignReportToProfile, getDataReporteFlujoCaja } from '../controllers/reporte.controller'
import passport from 'passport'

const router = Router();

router.post('/getReportesByPerfil', getReportesByPerfil);
router.post('/getDataReporteResumidos', passport.authenticate('jwt', { session: false }), getDataReporteResumidos);
router.post('/getDataReporteDetallado', passport.authenticate('jwt', { session: false }), getDataReporteDetallado);
router.get('/getReportes', passport.authenticate('jwt', { session: false }), getReportes);
router.post('/assignReportToProfile', passport.authenticate('jwt', { session: false }), assignReportToProfile);
router.post('/getDataReporteFlujoCaja', passport.authenticate('jwt', { session: false }), getDataReporteFlujoCaja);

export default router;