const express = require('express');
const checkJwt = require('../../middleware/admin/user_auth');
const User = require('../../models/User/Auth');
const Order = require('../../models/User/Order');
const router = express.Router();




/**
 * Cart
 */

router.post('/add_order', checkJwt, async (req, res, next) => {

        let existUser = await User.findOne({
            _id: req.user.id
        });



        let order = new Order();


        
         existUser.task_items.map(cart => {
            
            // const total_price = existUser.total_price;
            // const quantity = existUser.quantity;

            console.log(cart.quantity);
            console.log(cart.task_item.service_price);

            // console.log(task_item._id);

            // let order_new = {
            //     task_item: task_item.task_item,
            //     quantity:quantity,
            //     paid_total_price: total_price,

            // };

            // order.user = req.user.id;

            // existUser.task_items.pop(task_item._id);



            // order.task_items.push(order_new);
        });

  
        // existUser.save();
        
        // order.save((err, added) => {

        //     if (added) {
        //         res.json({
        //             success: true,
        //             msg: 'Successfully Ordred. Your order ID is ' + added._id,
        //             cart: added
        //         });
        //     } else {
        //         if (err) {
        //             res.json(err);
        //         }
        //     }
        // });

    });

      
    // } else {
       

        // let order = new Order();

     
        // let order_new = {
        //     task_item: task_items.task_item,
        //     quantity:quantity,
        //     paid_total_price: total_price,

        // };


        // order.task_items.push(order_new);




        // order.save((err, added) => {

        //     if (added) {
        //         res.json({
        //             success: true,
        //             msg: 'Successfully Ordred. Your order ID is ' + added._id,
        //             cart: added
        //         });
        //     } else {
        //         if (err) {
        //             res.json(err);
        //         }
        //     }
        // });
    // }

    //     if (duplicate) {

    //         User.findOneAndUpdate({
    //                 _id: req.user.id,
    //                 "task_items.task_item": req.query.productId
    //             }, {
    //                 $inc: {
    //                     "task_items.$.quantity": 1
    //                 },
    //                 total_price: price
    //             }, {
    //                 new: true
    //             },
    //             (err, userInfo) => {
    //                 if (err) return res.json({
    //                     success: false,
    //                     err
    //                 });
    //                 res.status(200).json({
    //                     success: true,
    //                     msg:'Incremneted cart',
    //                     cart: userInfo
    //                 })
    //             }
    //         )
    //     } else {

    //         User.findOneAndUpdate({
    //                 _id: req.user.id
    //             }, {
    //                 $push: {
    //                     task_items: {
    //                         task_item: req.query.productId
    //                     }
    //                 },
    //                 total_price: price
    //             }, {
    //                 new: true
    //             },
    //             (err, userInfo) => {
    //                 if (err) return res.json({
    //                     success: false,
    //                     err
    //                 });
    //                 res.status(200).json({
    //                     success: true,
    //                     msg:'Successfully pushed',
    //                     cart: userInfo
    //                 })
    //             }
    //         )

    //     }
    // } else {

        // let user = new User();

        // let data = await Services.findById(product_id);
        // console.log(data.service_price)

        // user.total_price = data.service_price;

        // let carts = {
        //     task_item: product_id
        // };
        // cart.task_items.push(carts);

        // cart.save((err, added) => {

        //     if (added) {
        //         res.json({
        //             success: true,
        //             msg: 'Added to cart successfully',
        //             cart: added
        //         });
        //     } else {
        //         if (err) {
        //             res.json(err);
        //         }
        //     }
        // });
    // }
// });





module.exports = router;