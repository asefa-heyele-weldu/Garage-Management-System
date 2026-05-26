import { z } from 'zod';
import { createVehicle, listVehicles } from '../services/garageService.js';

const vehicleSchema = z.object({
  customerId: z.coerce.number().int().positive(),
  plateNumber: z.string().min(2),
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.coerce.number().int().optional().nullable(),
  vin: z.string().optional().nullable(),
  status: z.string().optional().nullable()
});

export async function getVehicles(req, res, next) {
  try {
    const vehicles = await listVehicles();
    res.json(vehicles);
  } catch (error) {
    next(error);
  }
}

export async function addVehicle(req, res, next) {
  try {
    const payload = vehicleSchema.parse(req.body);
    const id = await createVehicle(payload);
    res.status(201).json({ id, message: 'Vehicle created successfully' });
  } catch (error) {
    next(error);
  }
}
