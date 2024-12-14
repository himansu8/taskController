import taskModel from '../models/taskModel.js';
import userModel from '../models/userModel.js';

export async function createTask(req, res) {
    try {
  
        const { taskName, taskDeadLine } = req.body

        // find user id database
        let userFound = await userModel.findById(req.user.user_id)
        //console.log(userFound)
        if (!userFound) {
            return res.status(404).json({ error: 'not found' })
        }

        let cur_date = new Date();
        let deadline_date = new Date(taskDeadLine);


        const existingTask = await taskModel.findOne({
            taskName: taskName
        });

        if (existingTask) {
            return res.status(400).json({ error: 'Task name already exists for this user' });
        }


        let taskObj = {
            userId: req.user.user_id,
            taskName,
            createdAt: cur_date,
            deadline: deadline_date,
            isCompleted: false,
        }

        let task = await taskModel.create(taskObj);

        res.status(200).json({ msg: "task created successfylly", task })

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "something went wrong" })
    }
}