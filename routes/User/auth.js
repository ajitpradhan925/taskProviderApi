const express = require('express')
const router = express.Router();
const User = require('../../models/User/Auth');
const auth = require('../../middleware/admin/user_auth');
const gravatar = require('gravatar')
const async = require('async');

const Services = require('../../models/admin/Services');
const Cart = require('../../models/User/Auth');


const faker = require('faker');
const {
    check,
    validationResult

} = require('express-validator');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');


// @route       GET admin/auth
// @desc         route
// @access      Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
            .populate('address')    
            .populate({
                path: 'task_items.task_item',
                populate: ({
                    path: 'subtask',
                    populate: ('task')
                })
            })
        res.json({
            success: true,
            user: user
        });
    } catch (error) {

        res.status(500).send('Server error: ' + error.message);
    }
});


// @route       POST user/auth
// @desc        Authenticate user and get token
// @access      Public

router.post('/login', [
    check('phone', 'Phone is required').exists(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    const phone = req.body.phone;
    const password = req.body.password;

    console.log(req.body)
    try {
        let user = await User.findOne({
            phone
        });

        if (!user) {
            return res.status(400).json({
                errors: [{
                    msg: 'Phone Invalid credentials'
                }]
            });
        }

        // Make password matches

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                errors: [{
                    msg: 'Invalid Password '
                }]
            });
        }

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload,
            process.env.jwtUserSecret, {
                expiresIn: 360000
            }, (err, token) => {
                if (err) throw err;
                res.json({
                    success: true,
                    token: token,
                    user: user
                });
            });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');

    }
});

// Register admin


// @route       POST api/users
// @desc        Register users
// @access      Public
router.post('/register', [
    check('name', 'Name is required').not().isEmpty(),
    check('phone', 'Please include a phone number').exists(),
    check('password', 'Please enter a password with 6 or more characters').isLength({
        min: 6
    })
], async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        name,
        phone,
        password
    } = req.body;

    try {
        let user = await User.findOne({
            phone
        });

        if (user) {
            return res.status(400).json({
                msg: 'User alredy registered'
            });
        }
        const avatar = gravatar.url(phone, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });

        user = new User({
            name,
            phone,
            avatar,
            password
        });

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload,
            process.env.jwtUserSecret, {
                expiresIn: 360000
            }, (err, token) => {
                if (err) throw err;
                res.status(200).json({
                    success: true,
                    token: token
                });
            });

    } catch (err) {
        console.error(err.message);
        return res.status(400).json({
            msg: 'Some error error occured try again later.'
        });
    }
});



// @route       GET single  user
// @desc         route
// @access      Public
router.get('/single/:uId', async (req, res) => {
    try {
        const user = await User.findById(req.params.uId).select('-password'); // leave password
        res.json(user);
    } catch (error) {

        res.status(500).send('Server error: ' + error.message);
    }
});



// @route       DELEET single  user
// @desc         route
// @access      Public
router.delete('/:uId', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.uId); // leave password
        res.json({
            success: true,
            message: "User deleted Successfully"
        });
    } catch (error) {

        res.status(500).send('Server error: ' + error.message);
    }
});




// @route       UPDATE single  user
// @desc         route
// @access      Public
router.put('/admin/updateUser/:uid', async (req, res, next) => {

    try {
        let user = await User.findById(req.params.uid);

        if (!user) {
            return next(`User not found with id of ${req.params.uid}`, 404);
        }


        user = await User.findByIdAndUpdate(req.params.uid, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            message: "Successfully updated user.",
            data: user
        });
    } catch (error) {
        next(error)
    }

});


// @route       GET all user
// @desc         route
// @access      Public
router.get('/all/users', (req, res, next) => {
    try {
        const perPage = 10;
        const page = req.query.page;
        async.parallel([

            function (callback) {
                User.estimatedDocumentCount({}, (err, count) => {
                    var totalUsers = count;
                    callback(err, totalUsers);
                });
            },
            function (callback) {
                User.find({})
                    .skip(perPage * page)
                    .limit(perPage)
                    .exec((err, users) => {
                        if (err) return next(err);
                        callback(err, users);
                    })
            }
        ], function (err, results) {
            var totalUsers = results[0];
            var users_total = results[1];

            res.json({
                success: true,
                message: 'Users',
                users: users_total,
                totalUsers: totalUsers,
                pages: Math.ceil(totalUsers / perPage)
            });
        });
    } catch (err) {
        next(err);
    }
});





/**
 * Cart
 */

router.post('/add_cart', auth, async (req, res, next) => {
    const product_id = req.query.productId;
    const quantity = req.query.quantity;
    const user = req.user.id;

    let existUser = await User.findOne({
        _id: req.user.id
    });

    if (existUser) {

        let duplicate = false;

        let data = await Services.find({
            _id: product_id
        });

        let price = existUser.total_price + data[0].service_price;

        existUser.task_items.map(task_items => {



            if (task_items.task_item == product_id) {
                console.log(task_items.task_item)

                duplicate = true;
            }



        });

        if (duplicate) {

            User.findOneAndUpdate({
                    _id: req.user.id,
                    "task_items.task_item": req.query.productId
                }, {
                    $inc: {
                        "task_items.$.quantity": 1
                    },
                    total_price: price
                }, {
                    new: true
                },
                (err, userInfo) => {
                    if (err) return res.json({
                        success: false,
                        err
                    });
                    res.status(200).json({
                        success: true,
                        msg:'Incremneted cart',
                        cart: userInfo
                    })
                }
            )
        } else {

            User.findOneAndUpdate({
                    _id: req.user.id
                }, {
                    $push: {
                        task_items: {
                            task_item: req.query.productId
                        }
                    },
                    total_price: price
                }, {
                    new: true
                },
                (err, userInfo) => {
                    if (err) return res.json({
                        success: false,
                        err
                    });
                    res.status(200).json({
                        success: true,
                        msg:'Successfully pushed',
                        cart: userInfo
                    })
                }
            )

        }
    } else {

        let user = new User();

        let data = await Services.findById(product_id);
        console.log(data.service_price)

        user.total_price = data.service_price;

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







// // ******************* Update Cart *************************
router.put('/update_cart', auth, async (req, res, next) => {
   
    try {
        const product_id = req.query.productId;
        let existUser = await User.findOne({
            _id: req.user.id
        });
        if (existUser) {
    
            let found = false;
    
            let data = await Services.find({
                _id: product_id
            });
    
            let price = existUser.total_price - data[0].service_price;
    
            existUser.task_items.map(task_items => {
    
    
    
                if (task_items.task_item == product_id) {
                    console.log(task_items.task_item)
    
                    found = true;
                }
    
                
    
            });



            if (found) {
    
                User.findOneAndUpdate({
                        _id: req.user.id,
                        "task_items.task_item": req.query.productId
                    }, {
                        $inc: {
                            "task_items.$.quantity": -1
                        },
                        total_price: price
                    }, {
                        new: true
                    },
                    (err, userInfo) => {
                        if (err) {
                            return res.status(404).json({
                                success: false,
                                err: err.message
                            });
                        }
                       
                        if(userInfo) {
                            return res.status(200).json({
                                data: userInfo
                            })
                        }
                    }
                )
            }


        }
    } catch(err) {
        
    
        console.log(err)
    }
})






// // ******************* Get Cart Of a User *************************
router.get('/get_cart', auth, (req, res, next) => {

    User.findById(req.user.id)
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


router.get('/delete_cart', auth , async (req, res) => {

    let cartId = req.query.cartId;

    let existUser = await User.findOne({
        _id: req.user.id
    });


    let isFoundCart = false;
    let foundCart = '';
    existUser.task_items.map(task_item => {
       if(task_item._id == cartId) {
        foundCart= cartId;
        isFoundCart = true;
       } else {
        isFoundCart = false;
       }
    });

    if(isFoundCart) {
        existUser.task_items.pop(foundCart);

        existUser.save((err, success) => {
            res.json({
                success: "Successfully deleted"
            })
        })
       
    } else {
        res.json({
            success: "false"
        })
    }

});








/***
 * ADDRESS
 * 
 */
//   .get(auth, (req, res, next) => {
//       User.findOne({
//           _id: req.decoded.user._id
//       }, (err, user) => {
//           res.json({
//               success: true,
//               address: user.address,
//               message: "Successful"
//           })
//       })
//   })







module.exports = router;