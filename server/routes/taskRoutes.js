import express from 'express';
import { authMiddleware } from '../middlewares/auth/verifyToken.js';
import { allTask, createTask, deleteTask, singleTask, summaryTask, updateTask } from '../controller/taskController.js';
import { taskNameValidation, validationErrors } from '../middlewares/validation/index.js';


const router = express.Router();

/*
description: create a single task
method :post
api_url: api/task
*/
router.post('/',authMiddleware,taskNameValidation(),validationErrors, createTask);


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
router.put('/:taskid',authMiddleware, updateTask);


/*
description: get a single task
method :get
api_url: api/task/:taskid
*/
router.get('/data/summary',authMiddleware,summaryTask);



export default router; 