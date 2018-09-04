//mongoose
var db = require('mongoose');
var Schema = db.Schema;
var bcrypt = require('bcrypt-nodejs');
//connect MongoDB
db.connect('mongodb://tuacoustic:Curveruler0312@ds153380.mlab.com:53380/tuacoustic');
var Schema = new Schema({
	name: {type: String, required: true},
	password: {type: String, required: true}
});
//bcrypt password
Schema.methods.encryptPassword = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}
Schema.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.password);
}
module.exports = db.model('user', Schema);