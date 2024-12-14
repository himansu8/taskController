import taskModel from '../models/taskModel.js';
import userModel from '../models/userModel.js';
import mongoose from 'mongoose';

export async function createTask(req, res) {
    try {
  
        const { taskName, taskDeadLine,priority,startDate   } = req.body

        if (priority < 1 || priority > 5) {
            return res.status(400).json({ error: 'Priority must be between 1 and 5' });
        }
        // find user id database
        let userFound = await userModel.findById(req.user.user_id)
        //console.log(userFound)
        if (!userFound) {
            return res.status(404).json({ error: 'not found' })
        }

        let cur_date = new Date(startDate );
        let deadline_date = new Date(taskDeadLine);


        let taskObj = {
            userId: req.user.user_id,
            taskName,
            createdAt: cur_date,
            deadline: deadline_date,
            isCompleted: false,
            priority,
        }

        let task = await taskModel.create(taskObj);

        res.status(200).json({ msg: "task created successfylly", task })

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "something went wrong" })
    }
}

export async function deleteTask(req, res) {
    try {
        const { taskid } = req.params


        let userFound = await userModel.findById(req.user.user_id)
        //console.log(userFound)
        if (!userFound) {
            return res.status(404).json({ error: 'not found' })
        }

        
        if (!mongoose.isValidObjectId(taskid)) {
            return res.status(400).json({ error: 'please pass valid taskid' })
        }

        let singletask = await taskModel.findOneAndDelete({ _id: taskid });
        //console.log(singletask)
        if (!singletask) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json({ msg: "task deleted successfylly" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "something went wrong" })
    }
}

export async function allTask(req, res) {
    try {
        if (!mongoose.isValidObjectId(req.user.user_id)) {
            return res.status(400).json({ error: 'please pass valid userid' })
        }

        let tasks = await taskModel.find({ userId: req.user.user_id });


        if (!tasks) {
            return res.status(404).json({ error: 'task not found' })
        }

        res.status(200).send(tasks)

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "something went wrong" })
    }
}

export async function singleTask(req, res) {
    try {
        const { taskid } = req.params

        if (!mongoose.isValidObjectId(taskid)) {
            return res.status(400).json({ error: 'please pass valid taskid' })
        }


        let singletask = await taskModel.findById(taskid);
        //console.log(singletask)

        if (!singletask) {
            return res.status(404).json({ error: 'task not found' })
        }
        res.status(200).send(singletask)

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "something went wrong" })
    }
}

export async function updateTask(req, res) {
    try {
        const { taskid } = req.params
        const { updateTaskName, taskDeadLine, newIsCompleted, updatePriority, updateStartDate  } = req.body
        //console.log(req.body);
        //console.log(req.params);

        if (updatePriority && (updatePriority < 1 || updatePriority > 5)) {
            return res.status(400).json({ error: 'Priority must be between 1 and 5' });
        }

        let userFound = await userModel.findById(req.user.user_id)
        //console.log(userFound)
        if (!userFound) {
            return res.status(404).json({ error: 'not found' })
        }



        if (!mongoose.isValidObjectId(taskid)) {
            return res.status(400).json({ error: 'please pass valid taskid' })
        }

        let deadline_date = new Date(taskDeadLine);

        let task = await taskModel.findByIdAndUpdate(
            taskid,
            { $set: { taskName: updateTaskName, deadline: deadline_date, isCompleted: newIsCompleted, priority:updatePriority, createdAt: new Date(updateStartDate)  } },
            { new: true }
        );
        if (!task) {
            return res.status(404).json({ error: 'task not found' })
        }
        //console.log(task)
       
        res.status(200).json({ msg: "task updated successfylly", task })

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "something went wrong" })



    }
}

export async function summaryTask(req, res) {
    try {
        const userId = req.user.user_id; 
        const tasks = await taskModel.find({ userId }); 
    
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter((task) => task.isCompleted).length;
        const pendingTasks = totalTasks - completedTasks;
    
        res.json({
          totalTasks,
          completedTasks,
          pendingTasks,
        });
    } catch (error) {
        console.error(error);
    res.status(500).send('Server error');
    }
}