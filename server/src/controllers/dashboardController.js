import { getDashboardSummary } from '../services/garageService.js';

export async function getDashboard(req, res, next) {
  try {
    const dashboard = await getDashboardSummary();
    res.json(dashboard);
  } catch (error) {
    next(error);
  }
}
