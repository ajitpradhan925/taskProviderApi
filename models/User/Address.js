const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
            addr1: String,
            addr2: String,
            city: String,
            state: String,
            country: String,
            postalCode: String,


            user: mongoose.Schema.Types.ObjectId
        

  

});

module.exports= User = mongoose.model('Address', AddressSchema);