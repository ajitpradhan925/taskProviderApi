const monngose = require('mongoose');
const Schema = monngose.Schema;
const OrderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    services: [{
        service: {type:Schema.Types.ObjectId, ref: 'Services'},
        quantity: { type: Number, default: 1 }
    }],
    paid_total_price: Number,
    discount: Number,
    paid_date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', OrderSchema);