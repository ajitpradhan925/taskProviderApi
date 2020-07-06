const express = require('express');
const checkJWT = require('../../middleware/admin/user_auth');
const router = express();
const Order = require('../../models/User/Order');
const Services = require('../../models/admin/Services');

router.post('/order' ,checkJWT, (req, res, next) => {
   try {

        const user = req.user.id;

        let order = new Order();

        order.user = user;

        let services = {
            service: req.body.service_id,
            quantity: req.body.quantity
        }

        
        order.services.push(services);
        
        order.save();
        res.json({
            success: true,
            message: 'Successfully Added the produce',
            data: product
        });
   } catch (error) {
       next(error.message);
       
   }
})