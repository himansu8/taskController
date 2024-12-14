import mongoose from 'mongoose';
const { Schema } = mongoose;

const taskSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel'
    },
    taskName: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    deadline: {
        type: Date,
        required: true
    },
    isCompleted: {
        type: Boolean,
        required: true
    },
    priority: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    }


});
export default mongoose.model('taskModel', taskSchema, "Tasks")