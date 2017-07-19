var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var bcrypt = require('bcrypt-nodejs');
//module used to encrypt password data


var UserSchema = new Schema({
	name:{type: String},
	traffic:{type: String},
	date:{type: String}

});

module.exports = mongoose.model('User', UserSchema);
