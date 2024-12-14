import express from 'express';
import { authMiddleware } from '../middlewares/auth/verifyToken.js';
import { allTask, createTask, deleteTask, singleTask, updateTask } from '../controller/taskController.js';


const router = express.Router();

/*
description: create a single task
method :post
api_url: api/task
*/
router.post('/',authMiddleware, createTask);


/*
description: delete a single task
method :delete
api_url: api/task/:taskid
*/
router.delete('/:taskid',authMiddleware,deleteTask);

/*
description: get a all task
method :get
api_url: api/task
*/
router.get('/',authMiddleware, allTask );

/*
description: get a single task
method :get
api_url: api/task/:taskid
*/
router.get('/:taskid',authMiddleware,singleTask);


/*
description: update a single task
method :patch
api_url: api/task/:taskid
*/
router.put('/:taskid',authMiddleware,updateTask);


export default router; 