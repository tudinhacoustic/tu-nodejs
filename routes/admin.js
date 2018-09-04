var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var User = require('../models/user');
var Product = require('../models/product');
//Token Protection
var csrfProtection = csrf();
router.use(csrfProtection);


//Xác thực người dùng là Admin
router.get('/home.html', isAdmin, function(req, res, next){
		User.findOne({name: req.session.username}, function(err, docs){
			if(err) throw err;
			res.render('admin/home',{users: docs});
		});
});


//Add User
router.get('/add/user.html',isAdmin, function(req, res, next){
	var messages = req.flash('error');
	res.render('admin/add/user', {title: 'Add User', csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length> 0 });
});
//Post Add User
router.post('/add/user.html', isAdmin, passport.authenticate('local.admin',{failureFlash: true, successRedirect: 'success.html', failureRedirect:'user.html'}));
router.get('/add/success.html', isAdmin, function(req, res, next){
	res.render('admin/add/success', {title: 'Success'});
});
router.get('/add/product.html', isAdmin, function(req, res, next){
	//var messages = req.flash('error');
	res.render('admin/product/add', {title: 'Add Product', csrfToken: req.csrfToken()});
})
router.post('/add/product.html', isAdmin, function(req, res,next){
	var insert = new Product();
	insert.imagePath = req.body.img;
	insert.title = req.body.title;
	insert.description = req.body.des;
	insert.price = req.body.pri;
	
	req.checkBody('title','Bạn chưa nhập tiêu đề').notEmpty();
	req.checkBody('img','Bạn chưa nhập đường dẫn hình').notEmpty();
	req.checkBody('img', 'Bạn phải nhập đường dẫn hình chính xác').isURL();
	req.checkBody('des','Bạn chưa nhấp mô tả sản phẩm').notEmpty();
	req.checkBody('pri','Bạn chưa nhập giá sản phẩm').notEmpty();
	req.checkBody('pri', 'Nhập số không quá 5 kí tự').isInt({max: 5});
	let article = {};
	article.title = req.body.title;
	
	let errors = req.validationErrors();
	
	if(errors){
		console.log(errors);
		res.render('admin/product/add',{title: 'Add Product', errors: errors});
	}else{
		insert.save(function(err, result){
			if(err) throw err;
			res.render('admin/add/success', {title: 'Success'});
		});
		//res.render('admin/add/success', {title: 'Success'});

	}
	//insert.save(function(err, result){
		//if(err) throw err;
		//console.log('Thành công');
	//});
	
});
router.get('/view/cart.html', function(req, res, next){
	res.render('admin/cart/index')
})


//Xác thực Admin(bảo mật Middle Ware)
function isAdmin(req, res, next){
	if(req.session.username === 'admin'){
		return next();
	}
	res.send('Bạn không được cấp quyền truy cập Admin');
}
//Nếu người dùng đã đăng nhập rồi
function notLoggedIn(req, res, next){
	if(!req.isAuthenticated()){
		return next();
	}
	res.send('Bạn đang đăng nhập');
}

module.exports = router;