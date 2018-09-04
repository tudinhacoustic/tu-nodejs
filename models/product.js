var db = require('mongoose');
var Schema = db.Schema;

//Connect MongoDB
db.connect('mongodb://tuacoustic:Curveruler0312@ds153380.mlab.com:53380/tuacoustic');

var schema = new Schema({
		imagePath: {type:String, required: true},
		title: {type:String, required: true},
		description: {type:String, required: true},
		price: {type:Number, required: true}
});

module.exports = db.model('sanpham',schema);
