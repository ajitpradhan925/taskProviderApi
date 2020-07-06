const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    task_items: [
        {
            task_item: {
                ref: 'Services',
                type: Schema.Types.ObjectId
                
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ],
    total_price: Number,
    created: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Cart', CartSchema);