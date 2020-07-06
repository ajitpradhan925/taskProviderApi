const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
    {
        taskName: {
            type: String,
            unique: [true, 'Cannot be same type of task.'],
            maxlength: [30, 'Task name should not be more than 30 characters'],
            required: true
        },

        taskDescription: String,
        adminId: String,
        image_url: String,
        taskImage: {
            type: String
        },
        createdAT: {
            type:Date,
            default: Date.now
        }
    }
);


module.exports = mongoose.model('Task', TaskSchema);