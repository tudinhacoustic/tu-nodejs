//Import from Models
var User = require('../models/user');
//Mongoose
var db = require('mongoose');
var bcrypt = require('bcrypt');
var salt = 10;
//var User = db.model('sanpham',schema);
var password = 'admin2';
//bcrypt.hash(password, salt, function(err, data){
	//if(err) throw err;
	//var Users = User({name:'admin2', password: data}).save(function(err){
			//if(err) throw err;
			//console.log('Database has been saved');
	//});
//});
bcrypt.genSalt(10, function(err, salt){
	var password = 'admin3';
	bcrypt.hash(password, salt, function(err, hash){
		var Users = User({name:'admin3', password: hash}).save(function(err){
			if(err)throw err;
			console.log('Your Database has been saved');
		})
	})
})




