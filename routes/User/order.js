const express = require('express');
const Order = require('../../models/user/Order');
const checkJwt = require('../../middleware/admin/user_auth');
const User = require('../../models/User/Auth'); 
const router = express.Router();




/**
 * Cart
 */


router.post('/add_order', checkJwt, async (req, res, next) => {

    

        let existUser = await User.findOne({
            _id: req.user.id
        });



        let order = new Order();


        
         existUser.task_items.map(task_item => {
            
            const total_price = existUser.total_price;
            const quantity = existUser.quantity;


            console.log(task_item._id);

            let order_new = {
                task_item: task_item.task_item,
                quantity:quantity,
                paid_total_price: total_price,

            };

            order.user = req.user.id;

            existUser.task_items.pop(task_item._id);

            

            order.task_items.push(order_new);
        });

        existUser.total_price = 0;
  
        existUser.save();
        
        order.save((err, added) => {

            if (added) {
                res.json({
                    success: true,
                    msg: 'Successfully Ordred. Your order ID is ' + added._id,
                    cart: added
                });
            } else {
                if (err) {
                    res.json(err);
                }
            }
        });

    });

      
  


module.exports = router;