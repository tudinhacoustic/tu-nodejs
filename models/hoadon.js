var db = require('mongoose');
var Schema = db.Schema;

//Connect MongoDB
db.connect('mongodb://tuacoustic:Curveruler0312@ds153380.mlab.com:53380/tuacoustic');

var schema = new Schema({
		idUser:{type: String, required: true},
		fullname:{type: String, required: true},
		email: {type:String, required: true},
		phone: {type:Number, required: true},
		totalPrice: {type:String, require: true},
		created_date:{
			type: Date,
			default: Date.now
		},
		status: {
			type: [{
				type: String,
				enum: ['available', 'unavailable']
			}],
			default: ['available']
		}
});

module.exports = db.model('hoadon',schema);
