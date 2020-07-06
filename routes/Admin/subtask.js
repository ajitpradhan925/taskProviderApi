const Task = require('../../models/admin/Task');
const SubTask = require('../../models/admin/SubTask');
const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = require('./utils/sub_task_image')
// Get subtasks
// METHOD GET/

router.get('/subtask_by_id', async(req, res, next) => {

    try {
        SubTask.find({"task":req.query.id})
        .populate("task")
        .exec(function(err, subtask) {
             res.json({success: true,total: subtask.length, "data":subtask});
        });
     
    } catch(err) {
        next(err);
    }
   
});

router.get('/', async(req, res, next) => {
    
    SubTask.find()
    .populate("task")
    .exec(function(err, subtask) {
        res.json({success: true,total: subtask.length, "data":subtask});
    });
 
   
 });


// Get subtasks by task id
// METHOD GET/


// Create subtasks
// METHOD Post/
// const singleUpload = upload.single('subtask_icon');
router.post('/:taskId', async(req, res, next) => {
    req.body.task = req.params.taskId;
    const task = await Task.findById(req.params.taskId)
    if(!task) {
        return new Error(`No Task with the id of ${req.params.taskId}`)
    }

    const subtask = await SubTask.create({
        "subtask_name": req.body.subtask_name,
        // "subtask_icon": req.file.location,
        "subtask_images": req.body.subtask_images,
        "slogan": req.body.slogan,
        "question": req.body.question,
        "task": req.params.taskId
    });


    res.status(200).json({
        success: true,
        data: subtask
    });
});

// @desc   DELETE task
// route    POST /task/:id  
// access   Private
router.delete('/:id', async (req, res, next) => {
    try {
        let subtask = await SubTask.findById(req.params.id);

        if (!Task) {
          return next(
            new Error(`Task not found with id of ${req.params.id}`)
          );
        }
       
        await subtask.remove();
        res.status(200).json({
            status: 'success',
            msg: 'Successfully deleted'
        });
    } catch (err) {
        next(err)
    }

});

module.exports = router;

