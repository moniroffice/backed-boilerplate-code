import express from 'express';
import testRoutes from '../../entities/test/b.routes.js'; 

const router = express.Router();

// Define all your routes here
router.use('/v1/tests', testRoutes);

export default router;

