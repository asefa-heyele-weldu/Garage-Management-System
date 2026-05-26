import { Router } from 'express';
import { addVehicle, getVehicles } from '../controllers/vehiclesController.js';

const router = Router();

router.get('/', getVehicles);
router.post('/', addVehicle);

export default router;
