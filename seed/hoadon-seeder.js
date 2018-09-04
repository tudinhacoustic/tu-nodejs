//Import from Models
var Product = require('../models/hoadon');
//Mongoose
var db = require('mongoose');
//var Product = db.model('sanpham',schema);
var products = [
	new Product({
		idSP: '1',
		title: 'Iphone X',
		fullname: 'Đinh Nguyễn Cẩm Tú',
		email: 'tudinhacoustic@gmail.com',
		phone: 0918754584,
		price: 999,
		status: 'unavailable',
	}),
];
//Upload to MongoDB
var done = 0;
for(var i = 0; i<products.length;i++){
	//console.log(products[i]);
	products[i].save(function(err,result){
		done++;
		if(done === products.length){
			stopLoop();
		}
	});
}
function stopLoop(){
	console.log("Your Database has been saved");
	db.disconnect();
}




