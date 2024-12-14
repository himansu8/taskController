import express from 'express';
import { authMiddleware } from '../middlewares/auth/verifyToken.js';
import { createTask } from '../controller/taskController.js';


const router = express.Router();

/*
description: create a single task
method :post
api_url: api/task
*/
router.post('/',authMiddleware, createTask);





export default router; 