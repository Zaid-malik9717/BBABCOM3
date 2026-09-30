import { Router } from 'express';
import tasksRoutes from './tasksRoutes.js';
import assignmentsRoutes from './assignmentsRoutes.js';
import routineRoutes from './routineRoutes.js';
import timetableRoutes from './timetableRoutes.js';
import goalsRoutes from './goalsRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Scholara Productivity Hub API',
  });
});

router.use('/tasks', tasksRoutes);
router.use('/assignments', assignmentsRoutes);
router.use('/routines', routineRoutes);
router.use('/timetable', timetableRoutes);
router.use('/goals', goalsRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
