import { Router } from 'express';
import { addCustomer, getCustomers } from '../controllers/customersController.js';

const router = Router();

router.get('/', getCustomers);
router.post('/', addCustomer);

export default router;
