import { z } from 'zod';
import { createServiceOrder, listServiceOrders, updateServiceOrderStatus } from '../services/garageService.js';

const serviceOrderSchema = z.object({
  vehicleId: z.coerce.number().int().positive(),
  serviceType: z.string().min(2),
  description: z.string().optional().nullable(),
  status: z.enum(['Open', 'In Progress', 'Completed', 'Cancelled']).optional(),
  priority: z.enum(['Low', 'Normal', 'High', 'Urgent']).optional(),
  estimatedCost: z.coerce.number().optional().nullable(),
  actualCost: z.coerce.number().optional().nullable()
});

const statusSchema = z.object({
  status: z.enum(['Open', 'In Progress', 'Completed', 'Cancelled'])
});

export async function getServiceOrders(req, res, next) {
  try {
    const orders = await listServiceOrders();
    res.json(orders);
  } catch (error) {
    next(error);
  }
}

export async function addServiceOrder(req, res, next) {
  try {
    const payload = serviceOrderSchema.parse(req.body);
    const id = await createServiceOrder(payload);
    res.status(201).json({ id, message: 'Service order created successfully' });
  } catch (error) {
    next(error);
  }
}

export async function changeServiceOrderStatus(req, res, next) {
  try {
    const id = z.coerce.number().int().positive().parse(req.params.id);
    const { status } = statusSchema.parse(req.body);
    await updateServiceOrderStatus(id, status);
    res.json({ message: 'Service order status updated successfully' });
  } catch (error) {
    next(error);
  }
}
