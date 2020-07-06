const mongoose = require('mongoose')

const BannerSchema = mongoose.Schema({
    title: String,
    description: String,
    image_url: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Banner", BannerSchema);