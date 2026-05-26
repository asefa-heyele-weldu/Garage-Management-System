import { Router } from 'express';
import { addServiceOrder, changeServiceOrderStatus, getServiceOrders } from '../controllers/serviceOrdersController.js';

const router = Router();

router.get('/', getServiceOrders);
router.post('/', addServiceOrder);
router.patch('/:id/status', changeServiceOrderStatus);

export default router;
