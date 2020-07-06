const express = require('express');
const router = express.Router();
const Address = require('../../models/User/Address');
const async = require('async');
const User = require('../../models/User/Auth');
const auth = require('../../middleware/admin/user_auth');



router.post('/add_address', auth, (req, res, next) => {

    async.waterfall([
        function(callback) {
            User.findById(req.user.id, (err, user) => {
                if (err) return next(err);
                
                if(user) {
                    callback(err,user);
                }
            });
        },
        function(user) {
            let address = new Address();
            address.user = req.user.id;

            if(req.body.addr1) address.addr1 = req.body.addr1;
            if(req.body.addr2) address.addr2 = req.body.addr2;
            if(req.body.city) address.city = req.body.city;
            if(req.body.state) address.state = req.body.state;
            if(req.body.country) address.country = req.body.country;
            if(req.body.postalCode) address.postalCode = req.body.postalCode;

            user.address.push(address._id);
            user.save();

            address.save();

            res.json({
                success: true,
                message: 'Successfully added the address'
              });

        }
    ])
    // User.findById(req.user.id, (err, user) => {
    //     if (err) return next();

    //     if(user) {
    //         const address = new User();
    //         address.addr = req.body.addr1;
    //         address.addr2 = req.body.addr2;
    //             address.city = req.body.city;
    //             address.state = req.body.state;
    //             address.country = req.body.country;
    //             address.postalCode = req.body.postalCode;
            

    //           address.save((err, added) => {

    //             if (added) {

    //                 const user = new User();

    //                 user.address.push()
    //                 res.json({
    //                     success: true,
    //                     msg: 'Added to address successfully',
    //                     address: added
    //                 });
    //             } else {
    //                 if (err) {
    //                     res.json(err);
    //                     console.log(err)
    //                 }
    //             }
    //         });

    //     }

    // });

});


module.exports = router;