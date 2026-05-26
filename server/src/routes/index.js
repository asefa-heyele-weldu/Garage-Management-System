import { Router } from 'express';
import dashboardRoutes from './dashboardRoutes.js';
import customersRoutes from './customersRoutes.js';
import vehiclesRoutes from './vehiclesRoutes.js';
import serviceOrdersRoutes from './serviceOrdersRoutes.js';

const router = Router();

router.use('/dashboard', dashboardRoutes);
router.use('/customers', customersRoutes);
router.use('/vehicles', vehiclesRoutes);
router.use('/service-orders', serviceOrdersRoutes);

export default router;
