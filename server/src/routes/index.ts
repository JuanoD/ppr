import { Router } from 'express';
import SchedulesRouter from "./Schedules";

// Init router and path
const router = Router();

// Add sub-routes
router.use('/schedules', SchedulesRouter);

// Export the base-router
export default router;
