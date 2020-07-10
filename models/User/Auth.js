const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        maxlength: [12, 'Phone no cant be more than 12'],
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    gender: String,
    avatar: String,
    address: [
        {
           
            ref: 'Address',
            type: mongoose.Schema.Types.ObjectId
        }
    ],
    task_items: [
        {
            task_item: {
                ref: 'Services',
                type: mongoose.Schema.Types.ObjectId
                
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ],

    orders: [
      {
          order_id: {
              ref: 'Order',
              type: mongoose.Schema.Types.ObjectId
          }
      }
    ],

    total_price: {
        type: Number,
        default: 0
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports= User = mongoose.model('user', UserSchema);