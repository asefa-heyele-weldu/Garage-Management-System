import { z } from 'zod';
import { createCustomer, listCustomers } from '../services/garageService.js';

const customerSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional().nullable(),
  email: z.preprocess(
    (value) => (value === '' ? undefined : value),
    z.string().email().optional().nullable()
  ),
  notes: z.string().optional().nullable()
});

export async function getCustomers(req, res, next) {
  try {
    const customers = await listCustomers();
    res.json(customers);
  } catch (error) {
    next(error);
  }
}

export async function addCustomer(req, res, next) {
  try {
    const payload = customerSchema.parse(req.body);
    const id = await createCustomer(payload);
    res.status(201).json({ id, message: 'Customer created successfully' });
  } catch (error) {
    next(error);
  }
}
