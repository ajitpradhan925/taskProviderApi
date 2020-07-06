const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    service_name: {
        type: String,
        required: true,
        // unique: true,
        trim: true
    },
    service_images: {
        type: String
    },
    service_time: {
        type: String
    },
    service_description: {
        type: String,
        trim: true
    },
    service_price: {
        type: Number
    },
    service_status: {
        type: String,
        default: true
    },
    service_enabled: {
        type: Boolean,
        default: true
    },
    subtask: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubTask',
        required: true
    },
    createdAT: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Services", ServiceSchema);