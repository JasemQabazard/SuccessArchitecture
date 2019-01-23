const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

// password and user name are not mentioned explicitly since passport module takes care of them and imbeds them in the user table automatically  

const User = new Schema({
    email: { 
        type: String, 
        unique: true, 
        trim:true, 
        lowercase:true 
    },
    firstname: {
        type: String, 
        default: ''
    },
    lastname:{
        type: String, 
        default: ''
    },
    countrycode: {
        type: String, 
        default: ''
    },
    mobile:{
        type: String, 
        unique: true, 
        trim:true
    },
    documentlocation: {                 // Avatar image at AWS Storage.
        type: String, 
        default: ''
    },
    birthdate: { 
        type: Date, 
        default: Date.now 
    },
    role: {
        type: String,
        default: 'CUSTOMER'         // ADMIN & CUSTOMER & TRAINER => future expansion
    },
    lastsignondate: {
          type: Date,
          default: Date.now
    }
}, {timestamps: true});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);