const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const OrderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    task_items: [
        {
            task_item: {
                ref: 'Services',
                type: mongoose.Schema.Types.ObjectId
                
            },
            quantity: {
                type: Number,
                default: 1
            },
            paid_total_price: Number,
            discount: Number,
            paid_date: {
                type: Date,
                default: Date.now
            }
        }
    ],
 
});

 
module.exports = mongoose.model('Order', OrderSchema);