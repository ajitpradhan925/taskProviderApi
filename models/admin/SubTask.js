const mongoose = require('mongoose')


const SubTaskSchema = new mongoose.Schema({
    subtask_name: {
        type: String,
        trim:true,
        required: [true, 'Please add a subtask title']
    },
    subtask_icon: {
        type: String
    },
    subtask_images: {
        type: String
    },

    slogan: {
        type: String
    },
    question: {
        type: String
    },
    createdID: {
        type: Date,
        default: Date.now
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    }
});

module.exports = mongoose.model('SubTask', SubTaskSchema);