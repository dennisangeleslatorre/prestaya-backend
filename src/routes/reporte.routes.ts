import { Router } from "express"
import { getReportesByPerfil, getDataReporteResumidos, getDataReporteDetallado, getReportes, assignReportToProfile,
        getDataReporteFlujoCaja, getDataReporteVencidosyNoVencidos, getPrestamosDetalladoPeriodo,getPrestamosUbicacionProducto } from '../controllers/reporte.controller'
import passport from 'passport'

const router = Router();

router.post('/getReportesByPerfil', getReportesByPerfil);
router.post('/getDataReporteResumidos', passport.authenticate('jwt', { session: false }), getDataReporteResumidos);
router.post('/getDataReporteDetallado', passport.authenticate('jwt', { session: false }), getDataReporteDetallado);
router.get('/getReportes', passport.authenticate('jwt', { session: false }), getReportes);
router.post('/assignReportToProfile', passport.authenticate('jwt', { session: false }), assignReportToProfile);
router.post('/getDataReporteFlujoCaja', passport.authenticate('jwt', { session: false }), getDataReporteFlujoCaja);
router.post('/getDataReporteVencidosyNoVencidos', passport.authenticate('jwt', { session: false }), getDataReporteVencidosyNoVencidos);
router.post('/getPrestamosDetalladoPeriodo', passport.authenticate('jwt', { session: false }), getPrestamosDetalladoPeriodo);
router.post('/getPrestamosUbicacionProducto', passport.authenticate('jwt', { session: false }), getPrestamosUbicacionProducto);

export default router;