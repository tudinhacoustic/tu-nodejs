//Import from Models
var Product = require('../models/product');
//Mongoose
var db = require('mongoose');
//var Product = db.model('sanpham',schema);
var products = [
	new Product({
		imagePath: 'https://icdn9.digitaltrends.com/image/apple-iphone-x-17-1500x1000.jpg',
		title: 'Iphone X',
		description: 'Hãy xem như một con điên và không có bán',
		price: 999
	}),
	new Product({
		imagePath: 'https://cdn2.techadvisor.co.uk/cmsdata/reviews/3672644/galaxy_s9_and_s9__0005.jpg',
		title: 'Samsung S9+',
		description: 'Samsung S9 pờ lớt đó thèm không méo bán Ahihi',
		price: 999
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




