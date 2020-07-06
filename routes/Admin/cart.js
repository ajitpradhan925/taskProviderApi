const express = require('express');
const Cart = require('../../models/admin/Cart');
const checkJwt = require('../../middleware/admin/user_auth');
const Services = require('../../models/admin/Services');

const router = express.Router();



/**
 * Add to cart
 */
router.post('/add_cart', checkJwt, async (req, res, next) => {
    const product_id = req.query.productId;
    const quantity = req.query.quantity;
    const user = req.user.id;

    let existUser = await Cart.findOne({
        user: req.user.id
    });
    
    if (existUser) {

        let duplicate = false;

        let data = await Services.find({
            _id: product_id
        });

        let price = existUser.total_price + data[0].service_price;

        existUser.task_items.map( task_items => {

    

            if (task_items.task_item == product_id) {
                console.log(task_items.task_item)
              
                duplicate = true;
            }


           
        });

        if (duplicate) {
            
            Cart.findOneAndUpdate(
                { user: req.user.id, "task_items.task_item": req.query.productId },
                { $inc: { "task_items.$.quantity": 1 }, total_price: price},
                { new: true },
                (err, userInfo) => {
                    if (err) return res.json({ success: false, err });
                    res.status(200).json(userInfo)
                }
            )
        } else {
         
            Cart.findOneAndUpdate(
                { user : req.user.id },
                {
                    $push: {
                        task_items: {
                            task_item: req.query.productId
                        }
                    }, total_price: price
                },
                { new: true },
                (err, userInfo) => {
                    if (err) return res.json({ success: false, err });
                    res.status(200).json(userInfo)
                }
            )

        }

        

        // if (existUser.task_items[0].task_item == product_id) {
        //     console.log("Product exists");
    //     existUser.total_price = data[0].service_price + existUser.total_price;


    //     existUser.save((err, incremented) => {

    //         if (incremented) {
    //             res.json({
    //                 success: true,
    //                 msg: 'Pushed',
    //                 incremented: incremented
    //             });

    //         } else {
    //             if (err) {
    //                 res.json(err);
    //             }
    //         }


    //     });
    // }

        // } else {

        //     console.log(existUser)
        //     existUser.task_items.push({
        //         task_item: product_id
        //     });

        //     let data = await Services.find({
        //         _id: product_id
        //     });
        //     existUser.total_price = data[0].service_price + existUser.total_price;


        //     existUser.save((err, incremented) => {

        //         if (incremented) {
        //             res.json({
        //                 success: true,
        //                 msg: 'Pushed',
        //                 incremented: incremented
        //             });

        //         } else {
        //             if (err) {
        //                 res.json(err);
        //             }
        //         }


        //     });
        // }
    } else {

        let cart = new Cart();
        cart.user = user;

        let data = await Services.findById(product_id);
        console.log(data.service_price)
        cart.total_price = data.service_price;

        let carts = {
            task_item: product_id
        };
        cart.task_items.push(carts);

        cart.save((err, added) => {

            if (added) {
                res.json({
                    success: true,
                    msg: 'Added to cart successfully',
                    cart: added
                });
            } else {
                if (err) {
                    res.json(err);
                }
            }
        });
    }
});



/**
 * Remover to cart
 */
// router.get('/removeFromCart', checkJwt, (req, res) => {

//     let existUser = await Cart.findOne({
//         user: req.user.id
//     });

//     let data = await Services.find({
//         _id: product_id
//     });

    
//     let price = existUser.total_price - 

//     Cart.findOneAndUpdate(
//         { user: req.user.id },
//         {
//             $pull: {
//                 task_items: {
//                     task_item: req.query.productId
//                 }
//             }, total_price: price
//         },
//         {
//              new: true 
//         },
//         (err, userInfo) => {
//             let cart = userInfo.cart;
//             let array = cart.map(item => {
//                 return item.id
//             })

//             Services.find({ '_id': { $in: array } })
//                 // .populate('writer')
//                 .exec((err, cartDetail) => {
//                     return res.status(200).json({
//                         cartDetail,
//                         cart
//                     })
//                 })
//         }
//     )
// })




// router.delete('/delete_cart', checkJwt, async (req, res, next) => {
//   const cart_id = req.query.cartId;
//   try {
//     await Cart.findById(cart_id);

//     await Cart.remove();
//     res.status(200).json({
//       success: true,
//       msg: 'Successfully deleted'
//     });
//   } catch (err) {
//     next(err)
//   }

// });



// // ******************* Add To Cart *************************
router.put('/update_cart', checkJwt, async (req, res, next) => {
  const product_id = req.query.productId;
  const quantity = req.query.quantity;
  const user = req.user.id;
  let existUser = await Cart.findOne({
    user: req.user.id
  });
  if (existUser) {

    let found = false;

    let data = await Services.find({
        _id: product_id
    });

    let price = existUser.total_price - data[0].service_price;

    existUser.task_items.map( task_items => {



        if (task_items.task_item == product_id) {
            console.log(task_items.task_item)
          
            found = true;
        }

        if (found) {
            
            Cart.findOneAndUpdate(
                { user: req.user.id, "task_items.task_item": req.query.productId },
                { $inc: { "task_items.$.quantity": -1 }, total_price: price},
                { new: true },
                (err, userInfo) => {
                    if (err) return res.json({ success: false, err });
                    res.status(200).json(userInfo)
                }
            )
        } 


       
    });
    // if (existUser.task_items[0].task_item == product_id) {

    //   let data = await Services.findById(product_id);
    //   existUser.total_price = existUser.total_price - data.service_price;
    //   existUser.task_items[0].quantity = existUser.task_items[0].quantity - 1;

    //   existUser.save((err, incremented) => {

    //     if (incremented) {
    //       res.json({
    //         success: true,
    //         msg: 'Decremented',
    //         incremented: incremented
    //       });
    //     } else {
    //       if (err) {
    //         res.json(err);
    //       }
    //     }
    //   });


    // }
  }
})






// // ******************* Get Cart Of a User *************************
router.get('/get_cart', checkJwt, (req, res, next) => {

    Cart.find({
            user: req.user.id
        })
        .populate('user', '-password')
        .populate({
            path: 'task_items.task_item',
            populate: ({
                path: 'subtask',
                populate: ('task')
            })
        })
        .exec((err, cart) => {
            res.json({
                msg: 'User not exists',
                cart: cart
            });
        })

});





// // Cart Increment
// // router.post('/cart_increment', checkJwt, (req, res, next) => {
// //   const product_id = req.query.productId;
// //   const quantity = req.query.quantity;
// //   const user = req.user.id;

// // Cart.findOne({ user: req.user.id}, (err, existUser) => {
// //     if(err) next(err);
// //     if(existUser) {

// //         if(existUser.task_items[0].task_item == product_id) {

// //           res.json({
// //             success: false,
// //             msg: 'Already Added to your cart'
// //           });
// //           //   existUser.task_items.push({
// //           //     task_item: product_id,
// //           //     quantity: quantity + 1
// //           // })

// //           // existUser.save();
// //         } else {
// //               existUser.task_items.push({
// //               task_item: product_id,
// //               quantity: quantity
// //           });

// //           existUser.save();


// //           res.json({
// //             success: false,
// //             msg: 'Added to cart successfully'
// //           });
// //         }



// //     } else {

// //       Cart.create({
// //         user,
// //         task_items: [{ product_id, quantity }]
// //       }, (err, carAdded) => {
// //         res.json({
// //           msg: 'User not exists',
// //           cart: carAdded
// //         });
// //       })
// //     }
// //   });

// // });




// // for(i = 0; i < cart.task_items.length; i ++ ){
// //   console.log(cart.task_items[0].task_item)
// //        TaskItem.find({_id: cart.task_items[0].task_item }).populate("item")
// //        .exec((err, data) => {
// //          console.log(data)
// //        })
// //    }
// // Cart.find({ _id: product_id }, (err, task_item) => {

// //   if(task_item) {

// //     let cart = new Cart();

// //     cart.totalPrice += task_item.subtaskItemPrice;
// //     cart.user = req.user.id;
// //     cart.task_items.push({
// //       task_item: product_id,
// //       quantity: quantity,
// //   })
// //   cart.save((err, item) => {
// //     if(item) {
// //       res.json({
// //         success: true,
// //         messasge: "Successfully made a payment",
// //         data: item
// //       });
// //     } else {
// //       res.json({
// //         success: false,
// //         messasge: err
// //       });
// //     }
// //   });


// //   }


// // });


// // let cart = new Cart();
// // cart.user = req.decoded.user._id;

// // if((cart.totalPrice) == null ) {
// //     cart.totalPrice = task_item.subtaskItemPrice;
// // } else {
// //     cart.totalPrice *= task_item.subtaskItemPrice;
// // }




// //   cart.task_items.push({
// //     task_item: cart.task_item._id,
// //     quantity: quantity,
// //     cart.totalPrice = task_item.subtaskItemPrice

// //   });

// // order.save();

// // });




module.exports = router;