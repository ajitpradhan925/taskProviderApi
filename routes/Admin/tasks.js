const upload = require('./utils/task_image_upload')

const express = require('express')
const Tasks = require('../../models/admin/Task')
const router = express.Router();
const multer = require('multer');




// @desc   Create new task
// route    POST /task  
// access   PRIVATE
const singleUpload = upload.single('taskImage');
router.post('/',singleUpload ,async (req, res, next) => {
   try {
    // Make sure the image is a photo
    const Task = await Tasks.create({ "taskName": req.body.taskName,"taskDescription":req.body.taskDescription, "taskImage": req.file.location });

    res.status(200).json({
        success: true,
        data: Task
    });
   } catch(err) {
    next(err)
}
});

// @desc   get all tasks
// route   GET /task  
// access   Public
router.get('/', async (req, res, next) => {
    try {
       
        const Task = await Tasks.find();
        res.status(200).json({
            success: true,
            total : Task.length,
            data: Task
        });
    } catch (err) {
        next(err)
    }

});


// @desc   get a single task
// route    GET /task/:id  
// access   Private
router.get('/:id', async (req, res, next) => {
    try {
        const Task = await Tasks.findById(req.params.id);
        res.status(200).json({
            success: true,
            data: Task
        });
    } catch (err) {
        next(err)
    }

});


// @desc   DELETE task
// route    POST /task/:id  
// access   Private
router.delete('/:id', async (req, res, next) => {
    try {
        let Task = await Tasks.findById(req.params.id);

        if (!Task) {
          return next(
            new Error(`Task not found with id of ${req.params.id}`)
          );
        }
       
        await Task.remove();
        res.status(200).json({
            success: true,
            msg: 'Successfully deleted'
        });
    } catch (err) {
        next(err)
    }

});





module.exports = router;