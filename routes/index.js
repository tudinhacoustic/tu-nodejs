var express = require('express');
var router = express.Router();


var Product = require('../models/product');
var Cart = require('../models/cart');
var User = require('../models/user');
//ChiTiet
var ChiTiet =  require('../models/chitiet');
//HoaDon
var HoaDon = require('../models/hoadon');

//Home
router.get('/',function(req,res,next){	
	var sortPrice = {price:1}
	Product.find(function(err, docs){
		res.render('index',{title: 'Shopping',products: docs});
	}).sort(sortPrice).limit(6);
});
//Cart
router.get('/add-to-cart/:id',isLoggedIn,setID, function(req, res, next){
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});
	
	Product.findById(productId, function(err, product){
		if(err){
			return res.redirect('/');
		}
		cart.add(product, product.id);
		req.session.cart = cart;
		//console.log(req.session.cart);
		res.redirect('/');
	})
});
router.get('/shopping-cart',isLoggedIn, function(req, res, next){
	if(!req.session.cart){
		return res.render('shop/shopping-cart', {products: null});
	}
	var cart = new Cart(req.session.cart);
	User.findOne({name: req.session.username}, function(err, user){
		if(err) throw err;
		console.log(user);
		res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice, findName: user});
	})
	
	
	//console.log(cart.generateArray());
});
router.get('/checkout.html',isLoggedIn, function(req, res, next){
	if(!req.session.cart){
		return res.redirect('/shopping-cart');
	}
	var cart = new Cart(req.session.cart);
	res.render('shop/checkout', {idUser: req.session.idUser,total: cart.totalPrice, products: cart.generateArray()});
	//console.log(cart.generateArray());
});
router.post('/checkout.html',isLoggedIn, function(req, res, next){	
	req.checkBody('fullname','Bạn chưa nhập tiêu đề').notEmpty();
	req.checkBody('fullname', 'Vui lòng nhập họ và tên trên 10 kí tự').isLength({min:10});
	req.checkBody('phone','Số điện thoại không được để trống').notEmpty();
	req.checkBody('phone', 'Số điện thoại buộc nhập số').isInt();
	req.checkBody('email', 'Email buộc nhập').notEmpty();
	req.checkBody('email', 'Email chưa chính xác').isEmail();
	let article = {};
	article.title = req.body.title;
	
	let errors = req.validationErrors();
	
	if(errors){
		console.log(errors);
		var cart = new Cart(req.session.cart);
		res.render('shop/checkout',{idUser: req.session.idUser,title: 'Add Product', errors: errors, total: cart.totalPrice});
	}else{
	var cart = new Cart(req.session.cart);
	
	//console.log(cart);
	var items = cart.generateArray();
	//console.log(items);
	items.forEach(function(result){
		console.log(result.item._id);
		console.log(result.item.price);
		
		var insert = new ChiTiet();
		insert.idSP = result.item._id;
		insert.idUser = result.item.idUser;
		insert.title = result.item.title;
		insert.fullname = req.body.fullname;
		insert.email = req.body.email;
		insert.phone = req.body.phone;
		insert.price = result.item.price;
		
		insert.save(function(err){
			if(err) throw err;
			//console.log('Lưu Database thành công');
			
		})
		
	})
	
	var insert = new HoaDon();
		insert.idUser = req.body.idUser;
		insert.fullname = req.body.fullname;
		insert.email = req.body.email;
		insert.phone = req.body.phone;
		insert.totalPrice = req.body.totalPrice;
		
		insert.save(function(err){
			if(err) throw err;
		})
	
			res.render('shop/success', {title: 'Success', total: cart.totalPrice});

		//res.render('admin/add/success', {title: 'Success'});

	}
	//console.log(cart.generateArray());
	
})

//giới thiệu
router.get('/DinhNguyenCamTu.html', function(req, res, next){
	res.render('info', {title: 'Admin Page - Dinh Nguyen Cam Tu'});
})

//Xác thực người dùng(bảo mật Middle Ware)
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.send('Bạn chưa đăng nhập');
	//res.redirect('/');
}
//Nếu người dùng đã đăng nhập rồi
function notLoggedIn(req, res, next){
	if(!req.isAuthenticated()){
		return next();
	}
	res.send('Bạn đang đăng nhập');
}

function setID(req, res, next){
	if(req.session.username != null){
		User.findOne({name: req.session.username}, function(err, data){
			req.session.idUser = data._id;
			console.log(req.session.idUser);
			return next();
		})
	}else{
		res.redirect('/');
	}
}
module.exports = router;
