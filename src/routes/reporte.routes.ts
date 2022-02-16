import { Router } from "express"
import { getReportesByPerfil, getDataReporteResumidos, getDataReporteDetallado, getReportes, assignReportToProfile } from '../controllers/reporte.controller'
import passport from 'passport'

const router = Router();

router.post('/getReportesByPerfil', getReportesByPerfil);
router.post('/getDataReporteResumidos', passport.authenticate('jwt', { session: false }), getDataReporteResumidos);
router.post('/getDataReporteDetallado', passport.authenticate('jwt', { session: false }), getDataReporteDetallado);
router.get('/getReportes', passport.authenticate('jwt', { session: false }), getReportes);
router.post('/assignReportToProfile', passport.authenticate('jwt', { session: false }), assignReportToProfile);


export default router;