const express = require('express');
const Tasks = require('../../models/admin/Task');
const SubTasks = require('../../models/admin/SubTask');
const Services = require('../../models/admin/Services');


const multer = require('multer');

const upload = require('./utils/subtask_item_image')


const router = express.Router();

// router.get('/task_items', async(req, res, next) => {
//     try{
//         let services = await Services.find({})
//         .populate({
//             path: 'subtask',
//             populate: ('task')
//           });

//         res.send({success: true, count: services.length, services: services})
//     } catch(err) {
//         next(err);
//     }
// })



router.get('/task_items',
 async(req, res, next) => {
    let subtaskId = req.query.subtaskId;
    console.log(req.query.subtaskId)
  try {
    const subtasks = await SubTasks.findById(subtaskId);

   
    if (!subtasks) {
        return res.send("SubTask of id "+ subtaskId + " not exits");
    }

    let services =await Services.find(
        {"subtask": subtaskId}
    ).populate({
        path: 'subtask',
        populate: ({
          path: 'task'
        })
      })
    res.status(200).send({success: true, length: services.length, data: services})
  } catch (error) {
      res.send(error);
  }
})


// const singleUpload = upload.single('services_images');
router.post('/task_items', async(req, res, next) => {
    
    let subtaskId = req.query.subtaskId;
    console.log(subtaskId)

  try {
    const subtasks = await SubTasks.findById(subtaskId);
    
    if (!subtasks) {
        return res.send("SubTask of id "+ subtaskId + " not exits");
    }

    let service = await Services.create({
        
        "service_name": req.body.service_name,
        // "service_images": req.file.service_images,
        "service_time": req.body.service_time,
        "service_description": req.body.service_description,
        "service_price":req.body.service_price,
        "service_status": req.body.service_status,
        "service_enabled": req.body.service_enabled,
        "subtask":req.query.subtaskId,
    });
    res.status(200).send({success: true,data: service})
  } catch (error) {
      res.status(500).send(error);
  }
});

// =============================================================================
// GET ALL ITEMS
// =============================================================================
router.get('/',
 async(req, res, next) => {

  try {

    let subtaskcategoryItem =await Services.find({});
    res.status(200).send({success: true, length: subtaskcategoryItem.length, data: subtaskcategoryItem})
  } catch (error) {
      res.send(error);
  }
})

// =============================================================================
// GET a single ITEM
// =============================================================================

// router.get('/tasks/:taskId/subtasks/:subtaskId/subtaskItem/:subtaskItemId',
//  async(req, res, next) => {
//     let taskId = req.params.taskId;
//     let subtaskId = req.params.subtaskId;
//     let subtaskcategoryItemsId = req.params.subtaskcategoryItemsId;

//   try {
//     const tasks = await Tasks.findById(taskId);
//     const subtasks = await SubTasks.findById(subtaskId);


//     if(!tasks) {
//         return res.send("Task of id "+ taskId + " not exits");
//     }
    
//     if (!subtasks) {
//         return res.send("SubTask of id "+ subtaskId + " not exits");
//     }
    
//     if(!tasks && !subtasks) {
//         return res.send("Task of id "+ taskId + " not exits and SubTask of id "+ subtaskId + " not exits");
//     }

//     const subtaskcategoryItem = await SubTaskCategoryItem.findById(subtaskcategoryItemsId);

//     if(!subtaskcategoryItem) {
//         return res.status(500).json({ success: false, message: "Sub Category Item Not Exists"});
//     } else {
//         let subtaskcategoryItems =await SubTaskCategoryItem.find({
//             _id: req.params.subtaskcategoryItemsId,
//             task: taskId,
//              subtask_id: subtaskId
//             }).populate("task")
//             .populate("subtask");
//         res.status(200).send({success: true,data: subtaskcategoryItems})
//     }


//   } catch (error) {
//       res.status(500).send(error.message);
//   }

  
    
// })





// =============================================================================
// UPDATE ITEM
// =============================================================================




// router.put('/tasks/:taskId/subtasks/:subtaskId/subtaskcategory/:subtaskcategoryId/subtaskcategoryItems/:subtaskcategoryItemsId', 
// upload.single('subtaskItemImage'), async(req, res, next) => {
//     let taskId = req.params.taskId;
//     let subtaskId = req.params.subtaskId;
//     let subtaskcategoryId = req.params.subtaskcategoryId;
//     let subtaskcategoryItemsId = req.params.subtaskcategoryItemsId;

//   try {
//     const tasks = await Tasks.findById(taskId);
//     const subtasks = await SubTasks.findById(subtaskId);
//     const subtaskcategory = await SubTaskCategory.findById(subtaskcategoryId);


//     if(!tasks) {
//         return res.send("Task of id "+ taskId + " not exits");
//     }
//     if (!subtaskcategory) {
//         return res.send("SubTask Category of id "+ subtaskcategoryId + " not exits");
//     }
    
//     if (!subtasks) {
//         return res.send("SubTask of id "+ subtaskId + " not exits");
//     }
    
//     if(!tasks && !subtasks) {
//         return res.send("Task of id "+ taskId + " not exits and SubTask of id "+ subtaskId + " not exits");
//     }

//     const subtaskcategoryItem = await SubTaskCategoryItem.findById(subtaskcategoryItemsId);

//     if(!subtaskcategoryItem) {
//         return res.status(500).json({ success: false, message: "Sub Category Item Not Exists"});
//     } else {
//         let subtaskcategoryItems =await SubTaskCategoryItem.findOneAndUpdate({
//             _id: req.params.subtaskcategoryItemsId,
//             task_id: taskId,
//              subtask_id: subtaskId,
//              subtask_category_id: subtaskcategoryId
//             },
//             {
//                 subtaskcategoryName: req.body.subtaskcategoryName,
//                 subtaskItemImage: req.file.location,
//                 subtaskItemTime: req.body.subtaskItemTime,
//                 description: req.body.description,
//                 subtaskItemPrice: req.body.subtaskItemPrice,
//                 subtaskItemStatus:  req.body.subtaskItemStatus

            
//             },{ new: true,
//                 runValidators: true});
//         res.status(200).send({success: true,data: subtaskcategoryItems})
//     }


//   } catch (error) {
//       res.status(500).send(error.message);
//   }

  
    
// })




// =============================================================================
// GET a single ITEM
// =============================================================================

// router.delete('/tasks/:taskId/subtasks/:subtaskId/subtaskcategory/:subtaskcategoryId/subtaskcategoryItems/:subtaskcategoryItemsId',
//  async(req, res, next) => {
//     let taskId = req.params.taskId;
//     let subtaskId = req.params.subtaskId;
//     let subtaskcategoryId = req.params.subtaskcategoryId;
//     let subtaskcategoryItemsId = req.params.subtaskcategoryItemsId;

//   try {
//     const tasks = await Tasks.findById(taskId);
//     const subtasks = await SubTasks.findById(subtaskId);
//     const subtaskcategory = await SubTaskCategory.findById(subtaskcategoryId);


//     if(!tasks) {
//         return res.send("Task of id "+ taskId + " not exits");
//     }
//     if (!subtaskcategory) {
//         return res.send("SubTask Category of id "+ subtaskcategoryId + " not exits");
//     }
    
//     if (!subtasks) {
//         return res.send("SubTask of id "+ subtaskId + " not exits");
//     }
    
//     if(!tasks && !subtasks) {
//         return res.send("Task of id "+ taskId + " not exits and SubTask of id "+ subtaskId + " not exits");
//     }

//     const subtaskcategoryItem = await SubTaskCategoryItem.findById(subtaskcategoryItemsId);

//     if(!subtaskcategoryItem) {
//         return res.status(500).json({ success: false, message: "Sub Category Item Not Exists"});
//     } else {
//         let subtaskcategoryItems =await SubTaskCategoryItem.findOneAndDelete({
//             _id: req.params.subtaskcategoryItemsId,
//             task_id: taskId,
//              subtask_id: subtaskId,
//              subtask_category_id: subtaskcategoryId
//             });
//         res.status(200).send({success: true,message: "Item Deleted Successfully!!"})
//     }


//   } catch (error) {
//       res.status(500).send(error.message);
//   }

  
    
// })



module.exports = router;