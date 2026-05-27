import { getDashboardSummary } from '../services/garageService.js';

/**
 * @desc    Get dashboard summary
 * @route   GET /api/dashboard
 * @access  Private (can be restricted by role)
 */
export async function getDashboard(req, res, next) {
  try {
    // Optional: Extract user info (if authentication exists)
    const user = req.user || null;

    // Optional: Query params (for filtering, date range, etc.)
    const { startDate, endDate } = req.query;

    // Call service with filters
    const dashboard = await getDashboardSummary({
      startDate,
      endDate,
      userId: user?.id,
    });

    // Add metadata
    const response = {
      success: true,
      message: "Dashboard data fetched successfully",
      timestamp: new Date().toISOString(),
      data: dashboard,
    };

    res.status(200).json(response);

  } catch (error) {
    // Add custom error logging
    console.error("Dashboard Error:", {
      message: error.message,
      stack: error.stack,
      user: req.user?.id || "guest",
    });

    next(error); // Pass to global error handler
  }
}